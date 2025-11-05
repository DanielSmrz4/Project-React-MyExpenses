import { useEffect, useState } from 'react'
import OneCategory from './OneCategory'


const Setup = () => {
  
  const defaultCategories = ['Income', 'Necessary', 'Food', 'Food at work', 'Other', 'For me', 'Subscriptions', 'Investements'];
  const [periodDate, setPeriodDate] = useState(''); // Date  
  const [incomeAmount, setIncomeAmount] = useState(''); // Income
  const [incomeName, setIncomeName] = useState('');  
  const [expenseAmount, setExpenseAmount] = useState(''); // Expenses
  const [expenseName, setExpenseName] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [incomeOverview, setIncomeOverview] = useState(0);// Overview
  const [expensesOverview, setExpensesOverview] = useState(0);
  const [remainingOverview, setRemainingOverview] = useState(0); 
  const [category, setCategory] = useState(''); // Categories
  const [categories, setCategories] = useState(defaultCategories);
  const [records, setRecords] = useState([]); // Records
  const [error, setError] = useState(''); // Error messages
  const [currency, setCurrency] = useState('Kč'); // Currency


  // =======================================
  // GENERAL FUNCTIONS
  // =======================================
  
  // Generate unique ID for records
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36)}`;
  };


  // =======================================
  // MAIN FUNCTIONS
  // =======================================


  const setPeriod = (e) => {
    e.preventDefault();

    // Validate date
    if (!periodDate) {
      setError('Enter and confirm date');
      return;
    } 

    // Validate set same date
    const setDate = localStorage.getItem("periodDate");
    if (setDate === periodDate) {
       setError('This date is already being used');
      return;
    }

    alert('New date confirmed');
    setError('');
    localStorage.clear(); 
    localStorage.setItem('periodDate', periodDate);    
  }


  const addIncome = (e) => {
    e.preventDefault();

    // Validate date
    const validDate = localStorage.getItem('periodDate');
    if (!validDate) {
      setError('Enter and confirm date');
      return
    }

    // Validate incomeAmount
    const amount = parseInt(incomeAmount);   
    if (!amount) {
      setError('Enter valid amount');
      return;
    }
  
    //  Validate leading zeores
    if (incomeAmount.startsWith('0') && incomeAmount.length > 1) {
      setError('Enter amount without leading zeores');
      return;
    }
    
    // Calculate new income and save to state and localStorage
    const newIncome = incomeOverview + amount;
    setIncomeOverview(newIncome);
    localStorage.setItem('income', newIncome.toString()); // Save updated value

    // Update remainingOverview
    setRemainingOverview(newIncome - (parseInt(expensesOverview) || 0));

    // Create new record
    const newRecord = {
      id: generateUniqueId(),
      category: 'Income',
      name: incomeName,
      amount: incomeAmount
    };

    // Save record to localStorage
    const updatedRecords = [...records, newRecord];
    localStorage.setItem('records', JSON.stringify(updatedRecords));
    setRecords(updatedRecords);
    
    // Clear inputs
    setError('')
    setIncomeName('');
    setIncomeAmount('');
  };


  const addExpense = (e) => {
    e.preventDefault();

    // Validate date
    const validDate = localStorage.getItem('periodDate');
    if (!validDate) {
      setError('Enter and confirm date');
      return
    }

    // Validate expenseAmount
    const amount = parseInt(expenseAmount);   
    if (!amount) {
      setError('Enter valid amount');
      return;
    }

    //  Validate leading zeores
    if (expenseAmount.startsWith('0') && expenseAmount.length > 1) {
      setError('Enter amount without leading zeores');
      return;
    }

    // Calculate new expenses and save to state and localStorage
    const newExpenses = expensesOverview + amount;
    setExpensesOverview(newExpenses);
    localStorage.setItem('expenses', newExpenses.toString()); // Save updated value

    // Update remainingOverview
    setRemainingOverview((parseInt(incomeOverview) - newExpenses || 0));

    // Create new record
    const newRecord = {
      id: generateUniqueId(),
      category: expenseCategory,
      name: expenseName,
      amount: expenseAmount
    };

    // Save record to localStorage
    const updatedRecords = [...records, newRecord];
    localStorage.setItem('records', JSON.stringify(updatedRecords));
    setRecords(updatedRecords);

    // Clear inputs
    setError('')
    setExpenseName('');
    setExpenseAmount('');
    setExpenseCategory('');
  }


  const addCategory = (e) => {
    e.preventDefault();
    const categoriesInLowerCase = categories.map((cat) => cat.toLowerCase());

    // Validate category 
    if (!category) {
      setError('Enter category name')
      return
    } else if (categoriesInLowerCase.includes(category.toLowerCase())) {
      setError('Category already exists')
      return
    }

    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    setCategory('');
    setError('') 
  }


 // ========================================
 // DELETE
 // ========================================


  const deleteCategory = (categoryToDelete) => {    
      // Remove category from categories
      const updatedCategories = categories.filter((cat) => cat !== categoryToDelete);
      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));

      // Remove records associated with the category
      if (records.length > 0) {
        const updatedRecords = records.filter((record) => record.category !== categoryToDelete);
        setRecords(updatedRecords);
        localStorage.setItem('records', JSON.stringify(updatedRecords));
      }    

      // Reset category state if the deleted category was selected
      if (category === categoryToDelete) {
        setCategory('');
      }

      // Update overview
      if (remainingOverview) {
        const updatedRecords = records.filter((record) => record.category !== categoryToDelete);
        const savedIncome = parseInt(localStorage.getItem('income'));    
        const updatedExpensesRecords = updatedRecords.filter((record) => record.category !== 'Income');   
        const updatedExpensesAmount = updatedExpensesRecords.reduce((sum, record) => sum + parseInt(record.amount), 0);
        
        localStorage.setItem('expenses', updatedExpensesAmount);
        setExpensesOverview(updatedExpensesAmount);
        setRemainingOverview(savedIncome - updatedExpensesAmount);
      }    
    }


  const deleteRecord = (recordId, recordCategory) => {
      const updatedRecords = records.filter((record) => record.id !== recordId);
      const savedIncome = parseInt(localStorage.getItem('income'));
      const savedExpenses = parseInt(localStorage.getItem('expenses'));

      setRecords(updatedRecords);
      localStorage.setItem('records', JSON.stringify(updatedRecords));

      if (recordCategory === 'Income') {
        const updatedIncomeRecords = updatedRecords.filter((record) => record.category === 'Income');
        const updatedIncomeAmount = updatedIncomeRecords.reduce((sum, record) => sum + parseInt(record.amount), 0);
        localStorage.setItem('income', updatedIncomeAmount);
        setIncomeOverview(updatedIncomeAmount);
        setRemainingOverview(updatedIncomeAmount - savedExpenses || 0);
      } 
      else if (recordCategory !== 'Income') {
        const updatedExpensesRecords = updatedRecords.filter((record) => record.category !== 'Income');   
        const updatedExpensesAmount = updatedExpensesRecords.reduce((sum, record) => sum + parseInt(record.amount), 0);
        localStorage.setItem('expenses', updatedExpensesAmount);
        setExpensesOverview(updatedExpensesAmount);
        setRemainingOverview(savedIncome - updatedExpensesAmount || 0);
      }   
    }


 // ========================================
 // DATA MANIPULATION
 // ========================================


  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedDate = localStorage.getItem('periodDate');
    const savedIncome = parseInt(localStorage.getItem('income'));
    const savedRecords = JSON.parse(localStorage.getItem('records'));
    const savedCategories = JSON.parse(localStorage.getItem('categories'));
    const savedExpenses = parseInt(localStorage.getItem('expenses'));

    if (savedDate) setPeriodDate(savedDate);
    if (savedIncome || savedExpenses) {
      setIncomeOverview(savedIncome || 0);
      setExpensesOverview(savedExpenses || 0);
      setRemainingOverview((savedIncome || 0) - (savedExpenses || 0));     
    }
    if (savedRecords) setRecords(savedRecords); 
    if (savedCategories) {
      setCategories(savedCategories);
    } else {
      setCategories(defaultCategories);
    }
  }, [])


  const resetData = () => {
    localStorage.removeItem('periodDate');
    localStorage.removeItem('income');
    localStorage.removeItem('expenses');
    localStorage.removeItem('categories');
    localStorage.removeItem('records');
    setPeriodDate('');
    setIncomeOverview(0);
    setExpensesOverview(0);
    setRemainingOverview(0);
    setCategories(defaultCategories);
    setRecords([]); 
  };


  return (
    <div className={'flex-col text-center p-4 max-w-[500px] mx-auto'}>
      <h1 className={'text-4xl mt-4 mb-8'}>MyExpenses</h1>
      {/* Set new period */}
      <form noValidate={false} className={'space-x-1 flex justify-center items-center'}>
        <span  className={'text-[1rem] text-blue-400'}>Set Date</span>
        <input
          type='date'
          id='date-input'
          value={periodDate}
          placeholder="mm/dd/yyyy"
          onChange={e => setPeriodDate(e.target.value)}
          required
          className={'outline-0 border rounded-md p-1.25 min-w-25 max-w-fit text-center'}
        />
        <button onClick={setPeriod} className={'border-2 p-1.25 rounded-md cursor-pointer text-blue-400 bg-slate-800'}>Confirm</button>
      </form>

      {/* Errors */}
      {error && <p className={'text-red-800 mb-8 mt-8'}>{error}</p>}

      {/* Overivew*/}
      <div className={'flex flex-1/3 justify-around mt-6 mb-4'}>
        <div className={'flex flex-col items-center'}>
          <p className={'text-[.75rem]'}>Income</p>
          <div className={'flex items-baseline space-x-1'}>
            <span className={'text-[1.5rem]'}>{incomeOverview}</span>
            <span className={''}>{currency}</span>
          </div>                   
        </div>        
        <div className={'flex flex-col items-center'}>
          <p className={'text-[.75rem]'}>Expenses</p>
          <div className={'flex items-baseline space-x-1'}>           
            {expensesOverview === 0 ? 
              <span className={'text-[1.5rem]'}>{expensesOverview}</span> :
              <span className={'text-[1.5rem]'}>-{expensesOverview}</span>           
            }
          <span>{currency}</span>
          </div>                          
        </div>          
        <div className={'flex flex-col items-center'}>
          <p className={'text-[.75rem]'}>Remaining</p>
          <div className={'flex items-baseline space-x-1'}>
            <span className={'text-[1.5rem] text-blue-400'}>{remainingOverview}</span>
            <span>{currency}</span>
          </div>
                   
        </div>
      </div>         

      {/* Add income*/}
      <div>
        <h2 className={'text-[1rem] text-left text-blue-400'}>Add Income</h2>
        <form
          onSubmit={addIncome}
          noValidate={false}
          className={'space-x-1 mb-2 flex items-baseline'}
        >
          <div className={'flex flex-col flex-4/5 space-y-1'}>
            <input
            type='text'
            placeholder='Name'
            value={incomeName}
            onChange={e => setIncomeName(e.target.value)}
            maxLength={30}
            required
            className={'border p-1.25 rounded-md'}
            />
            <input
              type='number'
              placeholder='Amount'
              value={incomeAmount}
              onChange={e => setIncomeAmount(e.target.value)}
              step='1'
              min={0}
              max={999999}
              required
              className={'border p-1.25 rounded-md'}
            />
          </div>        
          <button className={'border-2 p-1.25 rounded-md cursor-pointer text-blue-400 bg-slate-800'}>Add</button>
        </form>
      </div>     

      {/* Add expense*/}
      <div>
        <h2 className={'text-[1rem] text-left text-blue-400'}>Add Expense</h2>
        <form
          onSubmit={addExpense}
          className={'space-x-1 mb-2 flex items-baseline'}
          >
          <div className={'flex flex-col flex-4/5 space-y-1'}>
            <input
            type='text'
            placeholder='Name'
            value={expenseName}
            onChange={e => setExpenseName(e.target.value)}
            maxLength={30}
            required
            className={'border p-1.25 rounded-md'}
            />
            <input
              type='number'
              placeholder='Amount'
              value={expenseAmount}
              onChange={e => setExpenseAmount(e.target.value)}
              step='1'
              min={0}
              max={999999}
              required
              className={'border p-1.25 rounded-md'}
            />
            <select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
              className={'border p-1.25 rounded-md'}
              required
            >
              <option value="" disabled>Select category</option>
              {categories.filter((cat) => cat != 'Income').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>        
          <button className={'border-2 p-1.25 rounded-md cursor-pointer text-blue-400 bg-slate-800'}>Add</button>
        </form>
      </div>
      

      {/* Add category */}
      <h2 className={'text-[1rem] text-left text-blue-400'}>Add Category</h2>
      <form className={'flex space-x-1 mb-12'}>
        <input
          type='text'
          placeholder='Name'
          id='category-name-input'
          value={category}
          onChange={e => setCategory(e.target.value)}
          maxLength={25}
          required
          className={'flex-4/5 border p-1.25 rounded-md'}
        />
        <button
          onClick={addCategory}
          className={'border-2 p-1.25 rounded-md cursor-pointer text-blue-400 bg-slate-800'}
          >Add
        </button>
      </form>

      {/* Map categories */}
      <ul>        
        {categories.length > 0 ? (
          categories.map((oneCategory, index) => {
            return (
              <OneCategory
                key={index}
                name={oneCategory}
                records={records.filter((record) => record.category === oneCategory)}
                deleteCategory={deleteCategory}
                currency={currency}
                deleteRecord={deleteRecord}
              />              
            )           
          })
        ) : (
          <p>No categories set</p>
        )}        
      </ul>

      <button className={'text-red-800 cursor-pointer m-4 border-2 px-2 py-0.5 rounded-md'} onClick={resetData}>Reset</button>
    </div>
  )
}

export default Setup