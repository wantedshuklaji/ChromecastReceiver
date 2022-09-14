/*
Copyright 2020 Google LLC. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * This sample demonstrates how to build your own Receiver for use with Google
 * Cast.
 */

'use strict';

// import { CastQueue } from './queuing.js';
// import { AdsTracker, SenderTracker, ContentTracker } from './cast_analytics.js';

/**
 * Constants to be used for fetching media by entity from sample repository.
 */
const ID_REGEX = '\/?([^\/]+)\/?$';
const CONTENT_URL =
  'https://storage.googleapis.com/cpe-sample-media/content.json';
// const CUSTOM_CHANNEL = 'urn:x-cast:com.example.cast.mynamespace';//mynamespace
const CUSTOM_CHANNEL = 'urn:x-cast:com.connectsdk'
const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();


const LOG_RECEIVER_TAG = 'Receiver';

/**
 * Debug Logger
 */
const castDebugLogger = cast.debug.CastDebugLogger.getInstance();

/**
 * WARNING: Make sure to turn off debug logger for production release as it
 * may expose details of your app.
 * Uncomment below line to enable debug logger and show a 'DEBUG MODE' tag at
 * top left corner.
 */
/*
castDebugLogger.setEnabled(false);

/**
 * Uncomment below line to show debug overlay
 */
castDebugLogger.showDebugLogs(false);

/**
 * Set verbosity level for Core events.
 */
castDebugLogger.loggerLevelByEvents = {
  'cast.framework.events.category.CORE':
    cast.framework.LoggerLevel.INFO,
  'cast.framework.events.EventType.MEDIA_STATUS':
    cast.framework.LoggerLevel.DEBUG
};

if (!castDebugLogger.loggerLevelByTags) {
  castDebugLogger.loggerLevelByTags = {};
}

/**
 * Set verbosity level for custom tag.
 * Enables log messages for error, warn, info and debug.
 */
castDebugLogger.loggerLevelByTags[LOG_RECEIVER_TAG] =
  cast.framework.LoggerLevel.DEBUG;
*/

// Custom implementation---------------
playerManager.addEventListener(
  cast.framework.events.EventType.PLAYER_LOAD_COMPLETE, () => {
    const audioTracksManager = playerManager.getAudioTracksManager();
    // Get all audio tracks
    const audiotracks = audioTracksManager.getTracks();

    // Choose the first audio track to be active by specifying its ID
    // audioTracksManager.setActiveById(tracks[3].trackId);

    //subtitless
    const textTracksManager = playerManager.getTextTracksManager();
    // Get all text tracks
    const subtracks = textTracksManager.getTracks();
    console.log(JSON.stringify(subtracks))
    console.log(JSON.stringify(audiotracks))

    // context.sendCustomMessage(CUSTOM_CHANNEL, JSON.stringify(subtracks));
    // context.sendCustomMessage(CUSTOM_CHANNEL, JSON.stringify(audiotracks));
    // context.sendCustomMessage(CUSTOM_CHANNEL,undefined, "{\"trackId\": 6 }");

    // Choose the first text track to be active by its ID
    // textTracksManager.setActiveByIds([tracks[0].trackId]);
    // Set the first matching language text track to be active
    // textTracksManager.setActiveByLanguage('en');

    // Create text tracks object
        // setTimeout(function(){
        //    // alert("Hello");
        //    const textTracksManager = playerManager.getTextTracksManager();
        //    const track1 = textTracksManager.createTrack();
        //    track1.trackContentType = 'text/vtt';
        //    track1.trackContentId = 'http://192.168.1.35:8089/subtitle%2Fdata%2Fuser%2F0%2Fcom.xtremecast%2Fcache%2FThe.Net.2.0.2006.1080p.WEBRip.x265-RARBG.vtt';
        //    track1.language = 'en';
        //    // track1.trackId=89;
        //    textTracksManager.addTracks([track1])
        //    textTracksManager.setActiveByLanguage('en');
        //
        //    // textTracksManager.setActiveByIds([track1.trackId]);
        //    console.log('subtitle attached')
        //    console.log(JSON.stringify(textTracksManager.getTracks()));
        //    checkMessageAction('');
        //  }, 5000);

        //
        // // Create track 1 for English text
        // const track1 = textTracksManager.createTrack();
        // track1.trackContentType = 'text/vtt';
        // track1.trackContentId = 'http://example.com/en.vtt';
        // track1.language = 'en';
        //
        // // Create track 2 for Spanish text
        // const track2 = textTracksManager.createTrack();
        // const track2Id = track2.trackId;
        // track2.trackContentType = 'text/vtt';
        // track2.trackContentId = 'http://example.com/spa.vtt';
        // track2.language = 'spa';
        //
        // // Add tracks
        // textTracksManager.addTracks([track1, track2]);
        //
  });

  function isSubtitleAvailable(track) {
      const textTracksManager = playerManager.getTextTracksManager();
      var tracks=textTracksManager.getTracks();
      for(var i=0;i<tracks.length;i++)
      {
        if(tracks[i].trackContentId!==undefined && (tracks[i].trackContentId.includes(track.trackContentId)||tracks[i].trackId===track.trackId)){
          return true
        }
      }
    return false
  }

  function toggleTracks(activeTracks) {
      const textTracksManager = playerManager.getTextTracksManager();
      var subTracks=textTracksManager.getTracks();
       const audioTracksManager = playerManager.getAudioTracksManager();
    // Get all audio tracks
    const audiotracks = audioTracksManager.getTracks();


      for(var i=0;i<activeTracks.length;i++)
      {
       for(var j=0;j<subTracks.length;j++)
       {
        if(subTracks[j].trackId===activeTracks[i]){
            textTracksManager.setActiveByIds([activeTracks[i]]);
            // textTracksManager.setActiveByLanguage('en');
            break;

        }
       }
       for(var k=0;k<audiotracks.length;k++){
        if(audiotracks[k].trackId===activeTracks[i]){
              if(audioTracksManager.getActiveId()!==activeTracks[i])
              audioTracksManager.setActiveById(activeTracks[i]);
            break;
        }
       }
      }
    // return false
  }

  function checkMessageAction(mediaInformation) {
    // mediaInformation='{"action":"ACTIVE_TRACKS","activeTrackIds": [1],"tracks":[{"trackId":0,"type":"TEXT","trackContentId":"/storage/emulated/0/Movies/Jurassic Park 3/Jurassic.Park.III.2001.1080p.BRrip.x264.YIFY.srt","name":"Jurassic.Park.III.2001.1080p.BRrip.x264.YIFY.srt","language":"en","subtype":"SUBTITLES"},{"trackId":1,"type":"TEXT","trackContentId":"/storage/emulated/0/Download/The.Ghost.and.the.Darkness.1996.720p.HDTV.x264-DON.srt","name":"The.Ghost.and.the.Darkness.1996.720p.HDTV.x264-DON.srt","language":"en","subtype":"SUBTITLES"}]}';
//just for making compact json bcoz that js can solve, dont put space b'w key & value otherwise it will also be cleaned
    // const regex = new RegExp("[\\s\\s]+", 'gm')
    // mediaInformation = mediaInformation.replace(regex, '');
    //
    // console.log('Substitution result: ', mediaInformation);


    var tracksArray = [];


    var json=mediaInformation;//JSON.parse(mediaInformation);
    if(json.action==="ACTIVE_TRACKS"){
        //   var activeTrackId=json.activeTrackIds[0];
          var tracks=json.tracks;
          const textTracksManager = playerManager.getTextTracksManager();
          console.log(JSON.stringify(textTracksManager.getTracks()));
          var track1;
          for(var i=0;i<tracks.length;i++)
          {
            if(!isSubtitleAvailable(tracks[i])){
            track1= textTracksManager.createTrack();
            track1.trackId=tracks[i].trackId;
            track1.name=tracks[i].name;
            track1.trackContentType = tracks[i].trackContentType;
            track1.trackContentId = tracks[i].trackContentId
            //'http://192.168.1.35:8089/subtitle%2Fdata%2Fuser%2F0%2Fcom.xtremecast%2Fcache%2FThe.Matrix.1999.UHD.BluRay.2160p.TrueHD.Atmos.7.1.HEVC.REMUX-FraMeSToR.vtt';
            track1.language = tracks[i].language//'en';
            // track1.type="text/vtt";
            console.log("Before"+track1.trackId)
            textTracksManager.addTracks([track1])
            console.log("After"+track1.trackId)
            }

    //         track1.trackId=tracks[i].trackId
    //         tracksArray.push(track1)

            // track1.trackId=89;
            // textTracksManager.setActiveByLanguage('en');
          }
          if(json.activeTrackIds!==undefined)
          toggleTracks(json.activeTrackIds);
          else
           textTracksManager.setActiveByIds(null);

    //       textTracksManager.addTracks(tracksArray)
          // textTracksManager.setActiveByIds([track1.trackId]);
        //   textTracksManager.setActiveByLanguage('en');


        }

  }


context.addCustomMessageListener(CUSTOM_CHANNEL, function(customEvent) {
  // handle customEvent.
  const message=customEvent.data;
  checkMessageAction(message)
  // context.sendCustomMessage(CUSTOM_CHANNEL,undefined,customEvent.data);
  console.log(message);
});

  // Intercept the EDIT_AUDIO_TRACKS request
  playerManager.setMessageInterceptor(cast.framework.messages.MessageType.EDIT_AUDIO_TRACKS, request => {
    // write logic to convert language codes here
    playerManager.getAudioTracksManager().setActiveByLanguage(request.language);
    console.log(JSON.stringify(request));

  });




// ----------------------------------------
/**
 * Example of how to listen for events on playerManager.
 */
playerManager.addEventListener(
  cast.framework.events.EventType.ERROR, (event) => {
    castDebugLogger.error(LOG_RECEIVER_TAG,
      'Detailed Error Code - ' + event.detailedErrorCode);
    if (event && event.detailedErrorCode == 905) {
      castDebugLogger.error(LOG_RECEIVER_TAG,
        'LOAD_FAILED: Verify the load request is set up ' +
        'properly and the media is able to play.');
    }
      
      
if(event.error!=undefined)
console.log("Customized Error:- Reason->"+event.error.reason+", Chromecast error code-> "+event.detailedErrorCode);
      
      
});

/**
 * Example analytics tracking implementation. See cast_analytics.js. Must
 * complete TODO item in google_analytics.js.
 */
// const adTracker = new AdsTracker();
// const senderTracker = new SenderTracker();
// const contentTracker = new ContentTracker();
// adTracker.startTracking();
// senderTracker.startTracking();
// contentTracker.startTracking();

/**
 * Adds an ad to the beginning of the desired content.
 * @param {cast.framework.messages.MediaInformation} mediaInformation The target
 * mediainformation. Usually obtained through a load interceptor.
 */
function addBreaks(mediaInformation) {
  castDebugLogger.debug(LOG_RECEIVER_TAG, "addBreaks: " +
    JSON.stringify(mediaInformation));
  return fetchMediaById('fbb_ad')
  .then((clip1) => {
    mediaInformation.breakClips = [
      {
        id: 'fbb_ad',
        title: clip1.title,
        contentUrl: clip1.stream.dash,
        contentType: 'application/dash+xml',
        whenSkippable: 5
      }
    ];

    mediaInformation.breaks = [
      {
        id: 'pre-roll',
        breakClipIds: ['fbb_ad'],
        position: 0
      }
    ];
  });
}

/**
 * Obtains media from a remote repository.
 * @param  {Number} Entity or ID that contains a key to media in JSON hosted
 * by CONTENT_URL.
 * @return {Promise} Contains the media information of the desired entity.
 */
function fetchMediaById(id) {
  castDebugLogger.debug(LOG_RECEIVER_TAG, "fetching id: " + id);

  return new Promise((accept, reject) => {
    fetch(CONTENT_URL)
    .then((response) => response.json())
    .then((obj) => {
      if (obj) {
        if (obj[id]) {
          accept(obj[id]);
        }
        else {
          reject(`${id} not found in repository`);
        }
      }
      else {
        reject('Content repository not found.');
      }
    });
  });
}


/**
 * Intercept the LOAD request to load and set the contentUrl and add ads.
 */

playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD, loadRequestData => {
    castDebugLogger.debug(LOG_RECEIVER_TAG,
      `loadRequestData: ${JSON.stringify(loadRequestData)}`);

    // If the loadRequestData is incomplete return an error message
    if (!loadRequestData || !loadRequestData.media) {
      const error = new cast.framework.messages.ErrorData(
        cast.framework.messages.ErrorType.LOAD_FAILED);
      error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
      return error;
    }

    // check all content source fields for asset URL or ID
    let source = loadRequestData.media.contentUrl
  //    || loadRequestData.media.entity || loadRequestData.media.contentId;

    // If there is no source or a malformed ID then return an error.
    if (!source || source == "" ){//|| !source.match(ID_REGEX)) {
      let error = new cast.framework.messages.ErrorData(
        cast.framework.messages.ErrorType.LOAD_FAILED);
      error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
      return error;
    }

    let sourceId = source.match(ID_REGEX)[1];
    castDebugLogger.debug(LOG_RECEIVER_TAG,
      "Interceptor received full URL");
    loadRequestData.media.contentUrl = source;
//     if(source.includes('.m3u8')){
//     loadRequestData.media.contentType = 'application/dash+xml';
//                  loadRequestData.media.streamType = cast.framework.messages.StreamType.LIVE;
//   }

    return loadRequestData;

    // Add breaks to the media information and set the contentUrl
    // return addBreaks(loadRequestData.media)
    // .then(() => {
      // If the source is a url that points to an asset don't fetch from backend
      if (sourceId.includes('.')) {
        castDebugLogger.debug(LOG_RECEIVER_TAG,
          "Interceptor received full URL");
        loadRequestData.media.contentUrl = source;
        return loadRequestData;
      }

      // Fetch the contentUrl if provided an ID or entity URL
      else {
        castDebugLogger.debug(LOG_RECEIVER_TAG, "Interceptor received ID");
        return fetchMediaById(sourceId)
        .then((item) => {
          let metadata = new cast.framework.messages.GenericMediaMetadata();
          metadata.title = item.title;
          metadata.subtitle = item.description;
          loadRequestData.media.contentId = item.stream.dash;
          loadRequestData.media.contentType = 'application/dash+xml';
          loadRequestData.media.metadata = metadata;
          return loadRequestData;
        })
      }
    // })
    // .catch((errorMessage) => {
    //   let error = new cast.framework.messages.ErrorData(
    //     cast.framework.messages.ErrorType.LOAD_FAILED);
    //   error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
    //   castDebugLogger.error(LOG_RECEIVER_TAG, errorMessage);
    //   return error;
    // });
  }
);

const playbackConfig = new cast.framework.PlaybackConfig();

/**
 * Set the player to start playback as soon as there are five seconds of
 * media content buffered. Default is 10.
 */
playbackConfig.autoResumeDuration = 5;
castDebugLogger.info(LOG_RECEIVER_TAG,
  `autoResumeDuration set to: ${playbackConfig.autoResumeDuration}`);

/**
 * Set the control buttons in the UI controls.
 */
const controls = cast.framework.ui.Controls.getInstance();
controls.clearDefaultSlotAssignments();

/**
 * Assign buttons to control slots.
 */
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_SECONDARY_1,
  cast.framework.ui.ControlsButton.QUEUE_PREV
);
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_PRIMARY_1,
  cast.framework.ui.ControlsButton.CAPTIONS
);
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_PRIMARY_2,
  cast.framework.ui.ControlsButton.SEEK_FORWARD_15
);
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_SECONDARY_2,
  cast.framework.ui.ControlsButton.QUEUE_NEXT
);

context.start({
  /*queue: new CastQueue(),*/
  playbackConfig: playbackConfig,
  supportedCommands: cast.framework.messages.Command.ALL_BASIC_MEDIA |
                      cast.framework.messages.Command.QUEUE_PREV |
                      cast.framework.messages.Command.QUEUE_NEXT |
                      cast.framework.messages.Command.STREAM_TRANSFER
});
