const ytdl = require('@distube/ytdl-core');

async function test() {
  try {
    const info = await ytdl.getInfo('0e3GPea1Tyg');
    console.log(info.videoDetails.title);
    const format = ytdl.chooseFormat(info.formats, { quality: '18' }); // MP4 360p or similar
    console.log(format.url.substring(0, 100) + '...');
  } catch (e) {
    console.error(e.message);
  }
}
test();
