// app/api/tasks/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch all tasks for a specific user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    console.log("hit")
    const tasks = await prisma.task.findMany({
      // where: {
      //   userId: Number(userId),
      // },
    });
    console.log(tasks)
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tasks' }, { status: 500 });
  }
}

// Create a new task
export async function POST(req) {
  try {
    const { description, subject, priority, deadline, userId } = await req.json();
    
    const task = await prisma.task.create({
      data: {
        description,
        subject,
        priority,
        deadline: new Date(deadline),
        isCompleted: false,
        userId: 1,
      },

    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating task' }, { status: 500 });
  }
}
