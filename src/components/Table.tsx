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
    <div className="w-full overflow-x-auto">
      <table className="table-auto border-collapse w-full min-w-[480px] mt-4">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`px-4 py-2 ${col.className || ""}`}
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
