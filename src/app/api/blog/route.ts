import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    const where: any = {};
    if (activeOnly) {
      where.isActive = true;
    }

    const posts = await prisma.blog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener las publicaciones del blog' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, content, image, category, metaTitle, metaDescription } = await request.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Los campos título, contenido y categoría son requeridos' },
        { status: 400 }
      );
    }

    const slug = slugify(title);
    const existingPost = await prisma.blog.findUnique({ where: { slug } });
    if (existingPost) {
      return NextResponse.json(
        { error: 'Ya existe una publicación con un título o slug similar' },
        { status: 400 }
      );
    }

    const post = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        image: image || null,
        category,
        author: user.name,
        metaTitle: metaTitle || `${title} | Superencasa Blog`,
        metaDescription: metaDescription || content.slice(0, 155),
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al crear la publicación' },
      { status: 500 }
    );
  }
}
