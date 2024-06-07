import  React from 'react'
import './styles.css';


const generate = () => {
 
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [prompt, setPrompt] =  React.useState<string>(" "); 
  const [data, setData] =  React.useState<string>(" ");
  const generateImage = async () => {
    try {
      const response = await fetch('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const result = await response.json();
      setImageUrl(result);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

 
  React.useEffect(() => {
    if (prompt) {
      console.log('Image URL:', imageUrl);
    }
    generateImage();
  }, [prompt]);
    
  const change=()=>{
      setPrompt(data);
    }
    const downloadImage = () => {
      if (imageUrl) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'generated_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
  return (
    
    <>
    <div id="search">
  <input type="text" id="promptInput" placeholder="Enter your prompt"  onChange={(e)=>setData(e.target.value)}/>
  <button id="generateButton" onClick={change}>Search</button>
  </div>
  {imageUrl && (
        <div id="show">
          <img src={imageUrl} alt="Generated Image" style={{ maxWidth: '100%' }} />
          <br />
          <button id="download" onClick={downloadImage}>Download Image</button>
        </div>
  )}
    </>
  )
}

}
export default generate

