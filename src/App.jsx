import { useCallback, useEffect, useState, useRef } from 'react'
//import './App.css'

function App() {
  //User controlled changes
  const [length, setLength] = useState(0) 
  //User controlled toggle
  const [numberAllowed, setNumberAllowed] = useState(false) 
  //User controlled toggle
  const [charAllowed, setCharAllowed] = useState(false) 
  //Generated toggle
  const [passwordInput, setPasswordInput] = useState("") 
  
  const [paste,setPaste] = useState("")


  //useCallback - To generate and to memoize, optimize by storing in cache
  const passwordGenerator = useCallback(()=>{
    let pass = ""
    let alp = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    let numbers = "0123456789"
    let char = "!@#$%^&*()_+{}:?><,./;[]=-`~"
    if(numberAllowed){alp+=numbers}
    if(charAllowed){alp+=char}
  
    for(let i=0; i<(length); i++)
    {
      const alpIndex = Math.floor(Math.random() * alp.length+1)
      pass += alp.charAt(alpIndex)
    }
    
    setPasswordInput(pass)

  }, [length, numberAllowed,charAllowed,setPasswordInput])
 
  

  //By Default, password doesn't generate. Hence useEffect is used to initiate whenever the dependencies change
  useEffect(()=>{passwordGenerator()}, [length, numberAllowed,charAllowed, passwordGenerator])



  //For highlighting purpose, Reference from the element is required.
  const passRef = useRef("")

  //useCallback for optimisation. Works without it too
  const copyPassword = useCallback(() => {
    passRef.current?.select() //To hightlight
    passRef.current?.setSelectionRange(0,length) //For optimisation
    window.navigator.clipboard.writeText(passwordInput) //Since React is CSR, access to Window Object is possible
  },[passwordInput])

  const pastePassword = useCallback(async () => {
    setPaste(await window.navigator.clipboard.readText())
  },[passwordInput])

  return (
    <>
      <div className='  max-w-2xl mx-auto rounded-xl p-5 border-2 mt-64 border-gray-500 backdrop-blur-xl hover:backdrop-brightness-150 transition-all duration-200 hover:shadow-sm shadow-black' > 
        <h1 className='text-4xl text-center font-sans text-green-200 '>Password Generator</h1>
        <p className='text-white my-4'>Generate a randomized password based on length. Move the length handle to generate, tick the box if you need numbers and/or characters included</p>
        <div className=' flex rounded-2xl my-3 overflow-hidden' > 
          <input 
          className="outline-none w-full  p-2"
          type='text'
          value={passwordInput}
          placeholder='password'
          readOnly
          ref={passRef}
          />
          <button onClick={copyPassword} className='bg-blue-600 relative px-3 text-white'>Copy</button>

        </div>
        <div className='flex w-full my-3 justify-evenly'>
          <div className='flex gap-3 m-3 px-4 bg-gray-500'>
            <input
            type="range"
            min={0}
            max={20}
            value={length}
            className='cursor-pointer'
            onChange={(e)=>{setLength(Number(e.target.value))}}
            />
            <label className='text-yellow-50  '>length : {length}</label>
          </div>
          <div className='flex gap-2 m-3 px-4 bg-gray-500'>
            <input
            type="checkbox"
            defaultChecked={false}
            value={numberAllowed}
            onChange={()=>{setNumberAllowed(!numberAllowed )}}
            />
            <label className='text-yellow-50 '>Number</label>
          </div>
          <div className='flex gap-2 m-3 px-4  bg-gray-500'>
            <input
            type="checkbox"
            defaultChecked={false}
            value={charAllowed}
            onChange={()=>{setCharAllowed(!charAllowed )}}
            />
            <label className='text-yellow-50'>Characters</label>
          </div>
          

        </div>
        <p className='text-white my-4'>After generating, copy to clipboard by clicking the copy button</p>
        <div className='bg-red-200 flex rounded-2xl overflow-hidden my-3'>
          <input 
            className="outline-none w-full  p-2 bg-white"
            type='text'
            placeholder='Click on Paste'
            readOnly
            defaultValue={paste}
          />
          <button onClick={pastePassword} className='bg-blue-600 relative px-3 text-white '>Paste</button>
        </div>
        
      </div>
    </>
  )
}

export default App
