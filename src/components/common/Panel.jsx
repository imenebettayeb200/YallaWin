/* Panel — the dark glass card used everywhere (title + optional buttons on the right). */
function Panel({ title, actions, className, children }) {
  return (
    <section className={"panel " + (className || "")}>
      {(title || actions) && (
        <div className="panel-head">
          {title && <h2 className="panel-title">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export default Panel;
