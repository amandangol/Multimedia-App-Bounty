import React, { useState, useEffect } from 'react';
import { data } from './data';
import { Header } from "./components/Header";
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer';
import { Pie, Bar } from 'react-chartjs-2';
import './App.css'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function App() {
  const [myFiles, setMyFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filePath, setFilePath] = useState("/file-server/");
  const [showChartModal, setShowChartModal] = useState(false);

  const handleDelete = () => {
    if (selectedFile) {
      const updatedFiles = myFiles.filter(file => file.id !== selectedFile.id);
      setMyFiles(updatedFiles);
      setSelectedFile(null);
    }
  };
  const handleDownload =()=>{
    if (selectedFile) {
      window.open(selectedFile.path, "_blank");
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
  
    // Create a unique ID for the file
    const fileId = Date.now().toString();
  
    // Create a new file object with necessary properties
    const newFile = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      path: URL.createObjectURL(file), // Generate a local URL for preview purposes
      created: file.lastModifiedDate, // Use lastModifiedDate as an example, replace it with the appropriate property
      author: 'John Doe', // Provide the author name or obtain it from another source
    };
  
    // Update the state to include the uploaded file
    setMyFiles((prevFiles) => [...prevFiles, newFile]);
  };
  const handleRename = () => {
    if (selectedFile) {
      const newName = prompt("Enter new name");
      if (newName !== null) {
        const newFiles = myFiles.map(file => {
          if (file.id === selectedFile.id) {
            return {
              ...file,
              name: newName
            };
          }
          return file;
        });
        setMyFiles(newFiles);
      }
      setSelectedFile(null);
    }
  };
    const handleShare = (file) => {
    const shareText = `Sharing file: ${file.name}\nPath: ${file.path}`;
  
    if (navigator.share) {
      navigator.share({
        title: 'Share File',
        text: shareText,
        url: file.path, // Include the file URL for sharing
      })
        .then(() => {
          console.log('File shared successfully');
        })
        .catch((error) => {
          console.error('Error sharing file:', error);
        });
    } else {
      // Fallback for unsupported browsers or platforms
      const shareUrl = encodeURIComponent(file.path);
      const platforms = [
        { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
        { name: 'Twitter', url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(shareText)}` },
        // Add more platforms as needed
      ];
  
      platforms.forEach((platform) => {
        window.open(platform.url, `_blank${platform.name}`);
      });
    }
  };
  
  useEffect(() => {
    // Add file details and metadata to the existing data array
    const updatedData = data.map((file) => ({
      ...file,
      created: new Date().toLocaleString(),
      author: 'Aman Dangol',
    }));

    setMyFiles(updatedData);
  }, []);

  useEffect(() => {
    // Perform the search whenever the search query changes
    const filteredResults = myFiles.filter((file) =>
      file.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    setSearchResults(filteredResults);
  }, [searchQuery, myFiles]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };


  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Files Breakdown',
      },
    },
  };

  return (
    <> 
      {showChartModal && (
        // Modal for files breakdown
        <div style={styles.modal}>
        <div style={styles.modalContent}>
         <div style={styles.modalHeader}>
          <p style={{ fontWeight: "bold" }}>Files Breakdown</p>
          <button style={styles.closeButton} onClick={() => setShowChartModal(false)}>close</button>
         </div>
         <div style={styles.modalBody}>
          <Pie
           data={{
            labels: ['Video', 'Audio', 'Document', 'Image'],
            datasets: [
             {
              label: 'Files Breakdown',
              data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
              backgroundColor: [
               'rgba(255, 99, 132, 0.2)',
               'rgba(54, 162, 235, 0.2)',
               'rgba(255, 206, 86, 0.2)',
               'rgba(75, 192, 192, 0.2)',
              ],
              borderColor: [
               'rgba(255, 99, 132, 1)',
               'rgba(54, 162, 235, 1)',
               'rgba(255, 206, 86, 1)',
               'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1,
             },
            ],
           }}
          />
          <Bar
           data={{
            labels: ['Video', 'Audio', 'Document', 'Image'],
            datasets: [
             {
              label: 'Files Breakdown',
              data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
              backgroundColor: [
               'rgba(255, 99, 132, 0.2)',
               'rgba(54, 162, 235, 0.2)',
               'rgba(255, 206, 86, 0.2)',
               'rgba(75, 192, 192, 0.2)',
              ],
              borderColor: [
               'rgba(255, 99, 132, 1)',
               'rgba(54, 162, 235, 1)',
               'rgba(255, 206, 86, 1)',
               'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1,
             },
            ],
           }}
           options={barChartOptions}
          />
         </div>
        </div>
       </div>
      )}

      <div className="App">
        <Header />

        <div style={styles.container}>
          <div style={{ padding: 10, paddingBottom: 0 }}>
            <p style={{ fontWeight: "bold" }}>My Files</p>
            <p>{selectedFile ? selectedFile.path : filePath}</p>
            <div style={styles.controlTools}>
              {/* Upload File Button */}
              <input
                type="file"

                accept="audio/*,video/*,image/*,application/pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="upload-button"
              />
              {/* <label htmlFor="upload-button" style={styles.controlButton}>
                Upload File
              </label> */}

              {/* Rename Button */}
              <button
             style={styles.controlButton}
            disabled={!selectedFile}
            onClick={() => {
              handleRename()
          }}
>
  Rename
</button>


{/* Files Breakdown Button */}
<button
  style={styles.controlButton}
  onClick={() => setShowChartModal(true)}
>
  Files Breakdown
</button>

{/* Download Button */}
<button
  style={styles.controlButton}
  disabled={!selectedFile}
  onClick={() => {
   handleDownload()
  }}
>
  Download
</button>

{/* Delete Button */}
<button
  style={styles.controlButton}
  disabled={!selectedFile}
  onClick={handleDelete}
>
  Delete
</button>
<spacer></spacer>
<div style={{ marginLeft: "30px" }}>&nbsp;</div>
<div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div> 

       {/* Display search results only when there is a search query */}
      {searchQuery && searchResults.length > 0 ? (
        <div className="search-results">
          {searchResults.map((file) => (
            <div
              key={file.id}
              onClick={() => {
                setSelectedFile(file);
              }}
              className={
                selectedFile && selectedFile.id === file.id
                  ? 'search-result selected'
                  : 'search-result'
              }
            >
              {file.name}
            </div>
          ))}
        </div>
      ) : null}

</div>
</div>


<div style={styles.fileContainer}>
<div style={{ width: "100%", padding: 10 }}>
{myFiles.map((file) => {
  if (file.path.slice(0, filePath.length) === filePath) {
    return (
      <div
        style={styles.file}
        className={selectedFile && selectedFile.id === file.id ? 'selectedFile' : ''}

        key={file.id}
        onClick={() => {
          if (selectedFile && selectedFile.id === file.id) {
            setSelectedFile(null);
            return;
          }
          setSelectedFile(file);
        }}
      >
        <p>{file.name}</p>
        { <br></br> }
        { <button onClick={() => handleShare(file)} style={{ padding: '5px 10px', borderRadius: '5px' ,cursor:'pointer' }}>Share</button> }
      </div>
    );
  }
})}
</div>

{selectedFile && (
  <div style={styles.fileViewer}>
    {selectedFile.type === 'video' && (
      <VideoPlayer path={selectedFile.path} />
    )}
    {selectedFile.type === 'audio' && (
      <AudioPlayer path={selectedFile.path} />
    )}
    {selectedFile.type === 'document' && (
      <DocumentViewer path={selectedFile.path} />
    )}
    {selectedFile.type === 'image' && (
      <ImageViewer path={selectedFile.path} />
    )}
    <p style={{ fontWeight: 'bold', marginTop: 10 }}>
      {selectedFile.name}
    </p>
    <p>
      Path: <span style={{ fontStyle: 'italic' }}>{selectedFile.path}</span>
    </p>
    <p>
      File Type: <span style={{ fontStyle: 'italic' }}>{selectedFile.type}</span>
    </p>
    <p>
      Size: <span style={{ fontStyle: 'italic' }}>{selectedFile.size} bytes</span>
    </p>
    <p>
      Created: <span style={{ fontStyle: 'italic' }}>{selectedFile.created}</span>
    </p>
    <p>
      Author: <span style={{ fontStyle: 'italic' }}>{selectedFile.author}</span>
    </p> 
    
  </div>
)}

</div>
</div>
</div>
</>
);
}


const styles = {
container: {
backgroundColor: '#fff',

color: '#000',
},
fileContainer: {
 
display: 'flex',
justifyContent: 'space-between',
alignItems: 'flex-start',
flexDirection: 'row',
backgroundColor: '#ccc', 
},

file: {
    backgroundColor: '#eee',
    padding: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    width: '100%',
    borderRadius: '10px',
  },
 

fileViewer: {
padding: '10px',
margin: '10px',
width: '30vw',
height: '100vh',
cursor: 'pointer',
borderLeft: '1px solid #000'
},
controlTools: {
display: 'flex',
gap: '10px',
alignItems: 'center',
flexDirection: 'row',
padding: '10px',
},
controlButton: {
padding: '10px',
border: 'none',
cursor: 'pointer',
fontWeight: 'bold',
backgroundColor: '#eee',
borderRadius: '5px',
},

// Modal styles...
modal: {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  backgroundColor: '#fff',
  padding: '20px',
  height: '50vh',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
},
modalClose: {
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '10px',
  cursor: 'pointer',
},
modalBody:{
  width: '100%',
  height: '90%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  padding: '10px',
},
modalHeader: {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
},
closeButton: {
  padding: '10px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  backgroundColor: '#eee',
}
};
             
