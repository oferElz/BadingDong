const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    // 1) Wrap in a scrollable container to avoid squishing on small screens
    <div className="w-full overflow-x-auto">
      {/* 2) Use `table-fixed` so expanding rows don’t shift other columns */}
      {/* 3) Give a minimum width so columns won’t collide on very small screens */}
      <table className="table-fixed border-collapse w-full min-w-[600px] mt-4">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={
                  // You can add a fixed width or min-width per column if desired
                  // Example: "w-[10rem] px-2" or "min-w-[8rem]"
                  col.className
                }
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => renderRow(item))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
