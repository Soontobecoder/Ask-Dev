import { Carousel} from 'react-bootstrap'

function Banner(){
    return(
        <>
            <Carousel nextIcon="" prevIcon="" className="">
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src= "https://mathiasverdoodt.be/images/banner.jpg"
                    alt="first slide"
                    height="350px"
                    />
                    <Carousel.Caption>
                    <h1 style={{marginBottom:'100px'}}>AskDev</h1>                    
                    <h5 style={{marginBottom:'20px'}}>Ask Dev is a forum for developers to discuss about their problems.</h5>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </>
    )
}

export default Banner