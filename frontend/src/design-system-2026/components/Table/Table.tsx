import { Key, ReactNode, useState } from 'react';
import { Button } from '../Button/Button';
import { CaretDownIcon } from '../../icons';
import styles from './Table.module.css';

export type TableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T, index: number) => ReactNode;
  sortValue?: (row: T) => string | number;
};
export type TableProps<T> = {
  caption: string;
  columns: readonly TableColumn<T>[];
  rows: readonly T[];
  rowKey: (row: T, index: number) => Key;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  emptyState?: ReactNode;
};

/** Semantic, keyboard-sortable table. Wide tables scroll within their labelled region. */
export function Table<T>({
  caption,
  columns,
  rows,
  rowKey,
  loading,
  error,
  onRetry,
  emptyState = 'No results to display.'
}: TableProps<T>): JSX.Element {
  const [sort, setSort] = useState<{ id: string; descending: boolean }>();
  const column = columns.find((item) => item.id === sort?.id);
  const ordered = rows.map((row, index) => ({ row, index }));
  const sortValue = column?.sortValue;
  if (sortValue)
    ordered.sort((a, b) => {
      const first = sortValue(a.row);
      const second = sortValue(b.row);
      const result =
        typeof first === 'number' && typeof second === 'number'
          ? first - second
          : String(first).localeCompare(String(second), undefined, { numeric: true });
      return sort?.descending ? -result : result;
    });
  const sortDirection = (item: TableColumn<T>): 'ascending' | 'descending' | 'none' | undefined => {
    if (!item.sortValue) return undefined;
    if (sort?.id !== item.id) return 'none';
    return sort.descending ? 'descending' : 'ascending';
  };
  return (
    <div className={styles.scroll} role="region" aria-label={caption} tabIndex={0}>
      <table className={styles.table} aria-busy={loading || undefined}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((item) => (
              <th key={item.id} scope="col" aria-sort={sortDirection(item)}>
                {item.sortValue ? (
                  <button
                    className={styles.sort}
                    type="button"
                    onClick={() =>
                      setSort({ id: item.id, descending: sort?.id === item.id && !sort.descending })
                    }
                  >
                    {item.header}
                    <CaretDownIcon
                      size={12}
                      aria-hidden="true"
                      className={sort?.id === item.id && !sort.descending ? styles.ascending : ''}
                    />
                  </button>
                ) : (
                  item.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading || error || rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.state}>
                {loading && <p role="status">Loading…</p>}
                {!loading && error && (
                  <div role="alert">
                    <p>{error}</p>
                    {onRetry && (
                      <Button variant="secondary" onClick={onRetry}>
                        Try again
                      </Button>
                    )}
                  </div>
                )}
                {!loading && !error && emptyState}
              </td>
            </tr>
          ) : (
            ordered.map(({ row, index }) => (
              <tr key={rowKey(row, index)}>
                {columns.map((item) => (
                  <td key={item.id}>{item.cell(row, index)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
