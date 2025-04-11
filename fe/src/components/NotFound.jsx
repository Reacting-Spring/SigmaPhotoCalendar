import '../css/NotFound.css'

function NotFound() {

    return (
        <>
        <div className='flex flex-col items-center'>
            <img src='/404.png'></img>
            <h1 className='text-6xl font-bold p-7 mt-5'>페이지 없음</h1>
            <p className='text-2xl'>잘못 찾아오신 것 같네요..</p>
        </div>
        </>
    )
}

export default NotFound