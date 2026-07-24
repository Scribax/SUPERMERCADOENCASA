import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para dejar una opinión' }, { status: 401 });
    }

    const { productId, rating, comment } = await request.json();

    if (!productId || rating === undefined) {
      return NextResponse.json(
        { error: 'El ID del producto y la calificación son obligatorios' },
        { status: 400 }
      );
    }

    const parsedRating = parseInt(rating);
    if (parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { error: 'La calificación debe ser un número entre 1 y 5' },
        { status: 400 }
      );
    }

    // Verify if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        productId,
      },
    });

    let review;
    if (existingReview) {
      // Update review
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating: parsedRating,
          comment: comment || null,
        },
      });
    } else {
      // Create new review
      review = await prisma.review.create({
        data: {
          userId: user.id,
          productId,
          rating: parsedRating,
          comment: comment || null,
        },
      });
    }

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al guardar la opinión' },
      { status: 500 }
    );
  }
}
