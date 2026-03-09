import { useState } from "react";


export default function QA_item({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='QA-border' data-bs-toggle="collapse"
      data-bs-target={`#${item.id}`}
      aria-expanded="false"
      aria-controls={item.id}
      onClick={() => setIsOpen(!isOpen)}>
      <div className='d-flex justify-content-between align-items-center ' >
        <p className='fifth-Q-title '>{item.title}</p>
        <div className='pe-2'  >
          <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}  `}></i>
        </div>
      </div>

      <div className="collapse" id={item.id}>
        <div className="border-0 bg-transparent pt-4">
          <p className='fifth-A'>{item.content}</p>
        </div>
      </div>
    </div>
  )
}