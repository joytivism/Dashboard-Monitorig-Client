import React from 'react';
import EmptyState from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

type DataTableAlign = 'left' | 'center' | 'right';

export interface DataTableColumn<T> {
  key: React.Key;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  align?: DataTableAlign;
  className?: string;
  headerClassName?: string;
  width?: string | number;
}

interface DataTableProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: Array<DataTableColumn<T>>;
  data: T[];
  getRowKey?: (row: T, index: number) => React.Key;
  caption?: React.ReactNode;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyState?: React.ReactNode;
  tableClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string | undefined);
}

const alignClasses: Record<DataTableAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export default function DataTable<T,>({
  columns,
  data,
  getRowKey,
  caption,
  emptyTitle = 'No data available',
  emptyDescription,
  emptyState,
  className,
  tableClassName,
  rowClassName,
  ...props
}: DataTableProps<T>) {
  const hasRows = data.length > 0;

  return (
    <div
      className={cn('overflow-x-auto rounded-[18px] bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]', className)}
      {...props}
    >
      <table className={cn('w-full min-w-[760px] border-collapse', tableClassName)}>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'bg-surface3 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted',
                  alignClasses[column.align ?? 'left'],
                  column.headerClassName
                )}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hasRows ? (
            data.map((row, index) => {
              const resolvedRowClassName = typeof rowClassName === 'function' ? rowClassName(row, index) : rowClassName;

              return (
                <tr
                  key={getRowKey ? getRowKey(row, index) : index}
                  className={cn('transition-colors hover:bg-surface2/55', resolvedRowClassName)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'border-t border-black/[0.045] px-4 py-3 text-[13px] text-text2',
                        alignClasses[column.align ?? 'left'],
                        column.className
                      )}
                    >
                      {column.cell(row, index)}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={Math.max(columns.length, 1)} className="border-t border-black/[0.045] px-4 py-8">
                {emptyState ?? <EmptyState title={emptyTitle} description={emptyDescription} />}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
