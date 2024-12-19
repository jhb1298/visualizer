import bgImage from '../images/bg.jpg';
import logo from '../images/logo.png'

const Homepage = ({ onLogin }) => {

    const email=localStorage.getItem('email')
    const handeleStartButtonClicked=()=>{
        if(email){
            fetch('http://localhost:8080/login', {
                method: "POST",
                headers: {
                    'content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                })
    
            }).then(res => res.text())
                .then(data => {
                    console.log(data)
                    if (JSON.parse(data).message === 'successful') {
                        window.location.href = '/code';
                    } else {
                        alert("It seems that you are not logged in. Please login or Register.");
                    }
                })
                .catch(err => {
                    console.log("Error", err)
                })
        }
        else{
            alert("Please Login or Register to continue.")
        }
        
    }
    return (
        <div className="relative flex flex-col space-y-10 min-h-screen bg-cover bg-center w-full  font-mono" style={{ backgroundImage: `url(${bgImage})` }}>
            <div>
                <img src={logo} className="h-40 w-60 p-5 box-content" alt="" />
            </div>
            <div className="flex flex-col justify-center items-center">
                <p className="text-5xl text-center "> Start your journey <br /> with drag and drop code editor</p>
                <button 
                className="text-xl m-5 border-2 border-slate-800 inline-block px-4 py-2" 
                onClick={() => {  handeleStartButtonClicked()}}
                >Start coding</button>
            </div>
            <div className="absolute bottom-0 right-0 left-0  w-full">
                <div className="flex justify-between items-center w-full">
                    <div className='flex items-center p-5  font-mono'>
                        <p>If you don't have an account please</p>
                        <button
                            className='text-slate-400 mx-2 border-[1px] border-slate-800 px-1px'
                            onClick={() => { window.location.href = '/reg'; }}
                        >
                            Register
                        </button>
                        <p>Otherwise you may </p>
                        <button
                            className='text-slate-400 mx-2 border-[1px]  border-slate-800 px-1px'
                            onClick={() => { window.location.href = '/log'; }}
                        >
                            LogIn
                        </button>
                    </div>
                    <p className="text-right pr-5 text-slate-300 ">Developed by- Jobayer Hossain</p>
                </div>
            </div>

        </div>


    );
};

export default Homepage;
