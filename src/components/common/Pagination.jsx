import Icon from "./Icon";

/* Pagination — "Showing 8 of 24" + previous / next buttons. */
function Pagination({ page, pageCount, onChange, shown, total }) {
  return (
    <div className="table-footer">
      <span className="muted small">
        Showing {shown} of {total}
      </span>
      <div className="pager">
        <button
          type="button"
          className="round-btn"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          <Icon name="chevronLeft" size={14}></Icon>
        </button>
        <button
          type="button"
          className="round-btn"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          <Icon name="chevronRight" size={14}></Icon>
        </button>
      </div>
    </div>
  );
}

export default Pagination;
