'use client'

import ReactDOM from 'react-dom'

// @ts-ignore
export function Modal ({ onClose, children, title }) {
  const handleCloseClick = (e: any) => {
    e.preventDefault()
    onClose()
  }

  const modalContent = (
    <div className='modal-overlay'>
      <div className='modal-wrapper'>
        <div className='modal'>
          <div className='modal-header'>
            <a href='#' onClick={handleCloseClick}>
              x
            </a>
          </div>
          {title && <h1>{title}</h1>}
          <div className='modal-body'>{children}</div>
        </div>
      </div>
    </div>
  )

  return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'))
}
