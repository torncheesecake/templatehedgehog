const tasks = [
  { title: "Review overdue invoices", due: "Today" },
  { title: "Approve annual plan discount", due: "Tomorrow" },
  { title: "Seat audit for Growth accounts", due: "This week" },
];

export function UpcomingTasks() {
  return (
    <section className="rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-5">
      <h2 className="text-xl font-semibold">Upcoming tasks</h2>
      <div className="mt-4 space-y-2.5">
        {tasks.map((task) => (
          <div key={task.title} className="rounded-lg border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-2.5">
            <p className="font-medium text-(--surface-strong)">{task.title}</p>
            <p className="text-sm text-(--dune-muted)">{task.due}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
