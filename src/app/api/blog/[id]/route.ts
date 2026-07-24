import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let post = await prisma.blog.findUnique({
      where: { id },
    });

    if (!post) {
      post = await prisma.blog.findUnique({
        where: { slug: id },
      });
    }

    if (!post) {
      return NextResponse.json({ error: 'Publicación no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al obtener la publicación' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, image, category, metaTitle, metaDescription, isActive } = body;

    const existingPost = await prisma.blog.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Publicación no encontrada' }, { status: 404 });
    }

    const updatedData: any = {};
    if (title !== undefined) updatedData.title = title;
    if (content !== undefined) updatedData.content = content;
    if (image !== undefined) updatedData.image = image;
    if (category !== undefined) updatedData.category = category;
    if (metaTitle !== undefined) updatedData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updatedData.metaDescription = metaDescription;
    if (isActive !== undefined) updatedData.isActive = isActive;

    const post = await prisma.blog.update({
      where: { id: existingPost.id },
      data: updatedData,
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al actualizar la publicación' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const existingPost = await prisma.blog.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Publicación no encontrada' }, { status: 404 });
    }

    await prisma.blog.delete({
      where: { id: existingPost.id },
    });

    return NextResponse.json({ success: true, message: 'Publicación eliminada' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al eliminar la publicación' },
      { status: 500 }
    );
  }
}
