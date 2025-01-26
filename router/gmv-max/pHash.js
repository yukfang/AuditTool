const ffmpeg = require('fluent-ffmpeg');
const { imageHash } = require('image-hash');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');


// Example video groups (replace with actual URLs)
const videoGroupA = [
    {
        material_id: 1,
        video_url: 'https://v16m-default.akamaized.net/bad9f4e793bb1136c60f9d64ed2a0404/67866807/video/tos/alisg/tos-alisg-ve-0051c001-sg/os4l4xliOnIruKvzA2QEm0aihftCp5BoABMAwd/?a=0&bti=Nzg3NWYzLTQ6&ch=0&cr=0&dr=0&cd=0%7C0%7C0%7C0&cv=1&br=19596&bt=9798&cs=0&ds=4&ft=.cwOVInz7ThV6SYOXq8Zmo&mime_type=video_mp4&qs=0&rc=OjVkNDVmZWRnaTo7aTplN0BpM2VvOXI5cm13dzMzODYzNEAxX15gMi1jXmAxYy0uNDNiYSMzb2hvMmRzMmxgLS1kMC1zcw%3D%3D&vvpl=1&l=202501140734527263F2C10C0B1BFAEE18&btag=e000b0000'
    },
    {
        material_id: 2,
        video_url: 'https://v16m-default.akamaized.net/bad9f4e793bb1136c60f9d64ed2a0404/67866807/video/tos/alisg/tos-alisg-ve-0051c001-sg/os4l4xliOnIruKvzA2QEm0aihftCp5BoABMAwd/?a=0&bti=Nzg3NWYzLTQ6&ch=0&cr=0&dr=0&cd=0%7C0%7C0%7C0&cv=1&br=19596&bt=9798&cs=0&ds=4&ft=.cwOVInz7ThV6SYOXq8Zmo&mime_type=video_mp4&qs=0&rc=OjVkNDVmZWRnaTo7aTplN0BpM2VvOXI5cm13dzMzODYzNEAxX15gMi1jXmAxYy0uNDNiYSMzb2hvMmRzMmxgLS1kMC1zcw%3D%3D&vvpl=1&l=202501140734527263F2C10C0B1BFAEE18&btag=e000b0000'
    }
];

const videoGroupB =  [
    {
        material_id: 3,
        video_url: 'https://v16m-default.akamaized.net/bad9f4e793bb1136c60f9d64ed2a0404/67866807/video/tos/alisg/tos-alisg-ve-0051c001-sg/os4l4xliOnIruKvzA2QEm0aihftCp5BoABMAwd/?a=0&bti=Nzg3NWYzLTQ6&ch=0&cr=0&dr=0&cd=0%7C0%7C0%7C0&cv=1&br=19596&bt=9798&cs=0&ds=4&ft=.cwOVInz7ThV6SYOXq8Zmo&mime_type=video_mp4&qs=0&rc=OjVkNDVmZWRnaTo7aTplN0BpM2VvOXI5cm13dzMzODYzNEAxX15gMi1jXmAxYy0uNDNiYSMzb2hvMmRzMmxgLS1kMC1zcw%3D%3D&vvpl=1&l=202501140734527263F2C10C0B1BFAEE18&btag=e000b0000'
    },
    {
        material_id: 4,
        video_url: 'https://v16m-default.akamaized.net/bad9f4e793bb1136c60f9d64ed2a0404/67866807/video/tos/alisg/tos-alisg-ve-0051c001-sg/os4l4xliOnIruKvzA2QEm0aihftCp5BoABMAwd/?a=0&bti=Nzg3NWYzLTQ6&ch=0&cr=0&dr=0&cd=0%7C0%7C0%7C0&cv=1&br=19596&bt=9798&cs=0&ds=4&ft=.cwOVInz7ThV6SYOXq8Zmo&mime_type=video_mp4&qs=0&rc=OjVkNDVmZWRnaTo7aTplN0BpM2VvOXI5cm13dzMzODYzNEAxX15gMi1jXmAxYy0uNDNiYSMzb2hvMmRzMmxgLS1kMC1zcw%3D%3D&vvpl=1&l=202501140734527263F2C10C0B1BFAEE18&btag=e000b0000'
    }
];


// Define constants
const FRAME_INTERVAL = 0.1; // Extract a frame every 0.1 seconds
const HASH_DIFFERENCE_THRESHOLD = 5; // Tolerance level for hash comparison

// Helper function to generate a safe file name from the material_id
function generateFileName(material_id) {
  return `${material_id}.mp4`;
}

// Download video from URL and save with material_id as file name
async function downloadVideo(url, filePath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filePath);

    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filePath); // Delete incomplete file on error
      reject(err);
    });
  });
}

// Get video duration using ffprobe
function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata.format.duration);
      }
    });
  });
}

// Function to extract frames from a video
function extractFrames(videoPath, outputDir, callback) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  ffmpeg(videoPath)
    .output(`${outputDir}/frame-%03d.jpg`)
    .outputOptions([`-vf fps=1/${FRAME_INTERVAL}`]) // Extract a frame every 0.1 seconds
    .on('end', () => callback())
    .on('error', (err) => console.error('Error extracting frames:', err))
    .run();
}

// Generate perceptual hashes for all extracted frames
function generateHashes(frameDir, callback) {
  const hashes = [];
  const files = fs.readdirSync(frameDir).filter(file => file.endsWith('.jpg'));

  let processed = 0;
  files.forEach((file) => {
    imageHash(path.join(frameDir, file), 16, true, (error, data) => {
      if (error) console.error('Hashing error:', error);
      else hashes.push(data);

      processed++;
      if (processed === files.length) callback(hashes);
    });
  });
}

// Compare two hash arrays with tolerance
function compareHashes(hashes1, hashes2) {
    let matches = 0;
    const matchedFrames = new Set();
  
    hashes1.forEach((hash1, index1) => {
      hashes2.forEach((hash2, index2) => {
        const diff = hammingDistance(hash1, hash2);
        if (diff <= HASH_DIFFERENCE_THRESHOLD && !matchedFrames.has(index2)) {
          matches++;
          matchedFrames.add(index2); // Avoid matching the same frame again
        }
      });
    });
  
    const similarity = (matches / Math.max(hashes1.length, hashes2.length)) * 100;
    return similarity.toFixed(2); // Return similarity percentage as a string
  }

// Calculate Hamming Distance between two hashes
function hammingDistance(hash1, hash2) {
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++;
  }
  return distance;
}

// Sort videos by duration
async function sortVideosByDuration(videoGroup) {
  const videoWithDuration = [];
  for (const video of videoGroup) {
    const videoPath = generateFileName(video.material_id); // Save video with material_id as file name
    await downloadVideo(video.video_url, videoPath);
    const duration = await getVideoDuration(videoPath);
    videoWithDuration.push({ material_id: video.material_id, videoPath, duration });
  }

  // Sort by video duration
  return videoWithDuration.sort((a, b) => a.duration - b.duration);
}

// Main comparison process for video groups
async function compareVideoGroups(groupA, groupB) {
  const sortedGroupA = await sortVideosByDuration(groupA);
  const sortedGroupB = await sortVideosByDuration(groupB);

  const length = Math.min(sortedGroupA.length, sortedGroupB.length);

  for (let i = 0; i < length; i++) {
    const videoA = sortedGroupA[i];
    const videoB = sortedGroupB[i];

    console.log(`Comparing: ${videoA.material_id}.mp4 vs ${videoB.material_id}.mp4`);

    extractFrames(videoA.videoPath, 'framesA', () => {
      extractFrames(videoB.videoPath, 'framesB', () => {
        generateHashes('framesA', (hashesA) => {
          generateHashes('framesB', (hashesB) => {
            const similarity = compareHashes(hashesA, hashesB);
            console.log(`Comparing: ${videoA.material_id}.mp4 vs ${videoB.material_id}.mp4 = ${similarity}%`);
          });
        });
      });
    });
  }
}


compareVideoGroups(videoGroupA, videoGroupB);

