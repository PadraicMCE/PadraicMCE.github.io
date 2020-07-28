// JavaScript Document
// set up basic variables for app

const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');

// disable stop button while not recording
stop.disabled = true;

if (navigator.mediaDevices.getUserMedia)
	{
		console.log('getUserMedia supported');
		
		const constraints = { audio: true };
		let chunks = [];
		
		let onSuccess = function(stream)
		{
			console.log('Onsuccess');
			const mediaRecorder = new MediaRecorder(stream);
			
			record.onclick = function()
			{
				mediaRecorder.start();
				console.log(mediaRecorder.state);
				console.log("recorder started");
				record.style.background = "red";
				
				stop.disabled = false;
				record.disabled = true;
			}
			
			stop.onclick = function()
			{
				mediaRecorder.stop();
				console.log(mediaRecorder.state);
				console.log("recorder stopped");
				record.style.background = "";
				record.style.color = "";
				
				stop.disabled = true;
				record.disabled = false;
			}
			
			mediaRecorder.onstop = function(e)
			{
				console.log("data available after MediaRecorder.stop() called");
				var d = new Date();
				const clipName = prompt('Enter a name for your sound clip?',d);
				const clipContainer = document.createElement('article');
				const clipLabel = document.createElement('p');
				const audio = document.createElement('audio');
				const deleteButton = document.createElement('button');
				const downloadButton = document.createElement('button');
				
				clipContainer.classList.add('clip');
				audio.setAttribute('controls', '');
				deleteButton.textContent = 'Delete';
				deleteButton.className = 'delete';
				downloadButton.textContent = 'Download';
				downloadButton.className = 'download';
				
				if(clipName == null)
					{
						clipLabel.textContent = 'Unnamed clip';
					}
				else
					{
						clipLabel.textContent = 'clipName';
					}
				
				clipContainer.appendChild(audio);
				clipContainer.appendChild(clipLabel);
				clipContainer.appendChild(deleteButton);
				clipContainer.appendChild(downloadButton);
				soundClips.appendChild(clipContainer);
				
				audio.controls = true;
				const blob = new Blob(chunks, {'type' : 'audio/ogg; codecs=opus'});
				chunks = [];
				const audioURL = window.URL.createObjectURL(blob);
				audio.src = audioURL;
				console.log("recorder stopped");
				
				deleteButton.onClick = function(e)
				{
					let evtTgt = e.target;
					evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
				}
				
				clipLabel.onClick = function() 
				{
					const exisingName = clipLabel.textContent;
					const newClipName = prompt('Enter a new name for sound clip?');
					if (newClipName === null)
					{
						clipLabel.textContent = existingName;
					}else{
						clipLabel.textContent = newClipName;
					}
				}
			}
			
			mediaRecorder.ondataavailable = function(e)
			{
				chunks.push(e.data);
			}
		}
		
		let onError = function(err)
		{
			console.log('The following error occured: ' + err);
		}
		
		navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
	}
	else{
		console.log('getUserMedia not supported on your browser');
}

