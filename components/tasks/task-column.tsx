'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskCard } from './task-card';
import { Task } from '@/lib/queries/tasks';

interface TaskColumnProps {
  column: {
    id: string;
    title: string;
    status: string;
  };
  tasks: Task[];
}

const columnColors = {
  todo: 'bg-gray-100 dark:bg-gray-800',
  in_progress: 'bg-blue-50 dark:bg-blue-950',
  review: 'bg-yellow-50 dark:bg-yellow-950',
  done: 'bg-green-50 dark:bg-green-950',
};

export function TaskColumn({ column, tasks }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.status,
  });

  return (
    <Card className={`${columnColors[column.status as keyof typeof columnColors]} min-h-[500px]`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={setNodeRef} className="space-y-3 min-h-[400px]">
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
}