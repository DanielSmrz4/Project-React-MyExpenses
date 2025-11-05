import { useState } from "react"
import { FaTrash } from 'react-icons/fa';


const OneCategory = ({ name, records, deleteCategory, currency, deleteRecord }) => {

  const totalAmount = records.reduce((sum, record) => sum + parseInt(record.amount), 0);


  return (
    <div className={'pb-4'}>
      <div className={'flex justify-between items-center'}>
        <div className={'flex items-baseline space-x-2'}>
          <h2 className={'text-blue-400 text-[1.25rem]'}>{name}</h2>
          {name != 'Income' &&
            <button
              className={'cursor-pointer'}
              onClick={() => deleteCategory(name)}
              >
              <FaTrash className={'text-slate-600'} />  
            </button>
          }
        </div>        
        <div className={'space-x-1 text-[1.25rem] flex items-baseline'}>                    
          {name === 'Income' || totalAmount === 0 ?
            <span className={'text-blue-400'}>{totalAmount}</span> :
            <span className={'text-blue-400'}>-{totalAmount}</span>
          }
          <span className={'text-[1rem]'}>{currency}</span>                                     
        </div>
      </div>
      <hr />
      <ul className={'ml-1 mt-1 mb-4 space-y-1'}>
        {records.length === 0 ? (
          <p className="text-slate-600">No records in this category</p>                      
        ) : (
          records.map((oneRecord, index) => {
            return (               
              <li key={index} className={'flex justify-between items-center'}>
                <div className={'flex items-center space-x-2'}>
                  <button
                    className={'cursor-pointer'}
                    onClick={() => deleteRecord(oneRecord.id, oneRecord.category)}
                  >
                    <FaTrash className={'text-slate-500'} />
                  </button>
                  <span>{oneRecord.name}</span>
                </div>                                
                <div className={'flex items-center space-x-1'}>
                  {oneRecord.category === 'Income' ?             
                  <span>{oneRecord.amount} {currency}</span> :
                  <span>-{oneRecord.amount} {currency}</span>
                  }                 
                </div>                
              </li>
            )                                        
          })
        )}
      </ul>
    </div>
  )
}

export default OneCategory