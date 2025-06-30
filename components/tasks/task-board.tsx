'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskCard } from './task-card';
import { TaskColumn } from './task-column';
import { useUpdateTask } from '@/hooks/use-query';
import { Task } from '@/lib/queries/tasks';

interface TaskBoardProps {
  tasks: Task[];
}

const columns = [
  { id: 'todo', title: 'To Do', status: 'todo' as const },
  { id: 'in_progress', title: 'In Progress', status: 'in_progress' as const },
  { id: 'review', title: 'Review', status: 'review' as const },
  { id: 'done', title: 'Done', status: 'done' as const },
];

export function TaskBoard({ tasks }: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const updateTask = useUpdateTask();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      updateTask.mutate({
        id: taskId,
        updates: { status: newStatus as any }
      });
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <div className="h-12 w-12 mx-auto mb-4 opacity-50">📋</div>
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p>Create your first task to get started with task management.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          return (
            <TaskColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}