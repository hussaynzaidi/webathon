// app/api/tasks/[taskId]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch a specific task by ID
export async function GET(req, { params }) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(params.taskId) },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching task' }, { status: 500 });
  }
}

// Update a specific task by ID
export async function PUT(req, { params }) {
  try {
    const { description, subject, priority, deadline, isCompleted } = await req.json();

    const task = await prisma.task.update({
      where: { id: Number(params.taskId) },
      data: {
        description,
        // subject,
        // priority,
        // deadline: new Date(deadline),
        // isCompleted,
      },
    });

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating task' }, { status: 500 });
  }
}

// Delete a specific task by ID
export async function DELETE(req, { params }) {
  try {
    await prisma.task.delete({
      where: { id: Number(params.taskId) },
    });

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting task' }, { status: 500 });
  }
}
