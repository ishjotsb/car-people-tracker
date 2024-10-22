import '../../style/home.css'

export default function Input({inputLabel, type, inputHandler, value}) {

    function handleInput(e) {
        inputHandler(e.target.value);
    }

  return (
    <div className='input-container'>
        <label className='input-label'><span>*</span> {inputLabel}:</label>
        <input type={type} placeholder={inputLabel} onChange={(e) => handleInput(e)} value={value} className='input' />
    </div>
  )
}
