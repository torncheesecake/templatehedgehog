const tasks = [
  { title: "Review overdue invoices", due: "Today" },
  { title: "Approve annual plan discount", due: "Tomorrow" },
  { title: "Seat audit for Growth accounts", due: "This week" },
];

export function UpcomingTasks() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold">Upcoming tasks</h2>
      <div className="mt-4 space-y-2.5">
        {tasks.map((task) => (
          <div key={task.title} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
            <p className="font-medium text-slate-900">{task.title}</p>
            <p className="text-sm text-slate-500">{task.due}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
