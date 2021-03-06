import "./viewPane.scss";
export default function ViewPane({ children, closePane }) {
  function handleClickClose() {
    closePane();
  }

  return (
    <div className="viewPane">
      <div className="container">
        <div className="titleBar">
          <button onClick={handleClickClose}>Cerrar</button>
        </div>

        <div className="content">{children}</div>
      </div>
    </div>
  );
}
