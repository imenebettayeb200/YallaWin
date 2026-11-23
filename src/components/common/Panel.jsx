/** Dark glass card used everywhere in the dashboard. */
export default function Panel({ title, actions = null, className = '', as: Tag = 'section', children, ...rest }) {
  return (
    <Tag className={`panel ${className}`} {...rest}>
      {(title || actions) && (
        <div className="panel-head">
          {title && <h2 className="panel-title">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </Tag>
  );
}
