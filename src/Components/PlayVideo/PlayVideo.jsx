import React, { useEffect, useState, useMemo } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import { value_converter } from '../../data';
import VideoSkeleton from '../VideoSkeleton/VideoSkeleton';
import moment from 'moment';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const PlayVideo = ({ videoId, searchTerm }) => {
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!videoId || typeof videoId !== 'string' || videoId.length !== 11) {
        setError('Invalid video ID');
        return;
      }

      try {
        const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok || !data.items || data.items.length === 0) {
          setError('Video not found or API rejected the request');
          return;
        }

        setApiData(data.items[0]);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Video fetch error:', err);
        setError('Network error');
      }
    };

    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    const fetchOtherData = async () => {
      if (!apiData?.snippet?.channelId) return;

      try {
        const channelURL = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        const channelRes = await fetch(channelURL);
        const channelJson = await channelRes.json();
        setChannelData(channelJson.items?.[0] || null);

        const commentURL = `https://youtube.googleapis.com/youtube/v3/commentThreads?textFormat=plainText&part=snippet&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
        const commentRes = await fetch(commentURL);
        const commentJson = await commentRes.json();
        setCommentData(commentJson.items?.filter(item => item?.snippet?.topLevelComment?.snippet) || []);

        const relatedURL = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=20&key=${API_KEY}`;
        const relatedRes = await fetch(relatedURL);
        const relatedJson = await relatedRes.json();
        setRelatedVideos(relatedJson.items || []);
      } catch (err) {
        console.error('Additional data fetch error:', err);
      }
    };

    fetchOtherData();
  }, [apiData]);

  const filteredSuggestions = useMemo(() => {
    if (!searchTerm?.trim() || !Array.isArray(relatedVideos)) return [];
    return relatedVideos.filter(video =>
      video.snippet?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, relatedVideos]);

  if (error) return <p className="error">{error}</p>;
  if (!apiData) return <VideoSkeleton />;

  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title="YouTube Video Player"
      ></iframe>

      <h3>{apiData.snippet.title}</h3>

      <div className="play-video-info">
        <p>
          {value_converter(apiData.statistics.viewCount)} Views &bull;{' '}
          {moment(apiData.snippet.publishedAt).fromNow()}
        </p>
        <div>
          <span><img src={like} alt="like" />{value_converter(apiData.statistics.likeCount)}</span>
          <span><img src={dislike} alt="dislike" />2</span>
          <span><img src={share} alt="share" />Share</span>
          <span><img src={save} alt="save" />Save</span>
        </div>
      </div>

      <hr />

      <div className="publisher">
        <img
          src={channelData?.snippet?.thumbnails?.default?.url || '/default-avatar.png'}
          alt="channel logo"
        />
        <div>
          <p>{apiData.snippet.channelTitle}</p>
          <span>
            {channelData
              ? value_converter(channelData.statistics.subscriberCount)
              : '1M'} Subscribers
          </span>
        </div>
        <button type="button">Subscribe</button>
      </div>

      {searchTerm?.trim() ? (
        <div className="search-results">
          <h4>Search Results</h4>
          {filteredSuggestions.length === 0 ? (
            <p>No matches for "{searchTerm}"</p>
          ) : (
            filteredSuggestions.map(video => {
              const vidId = typeof video.id === 'string'
                ? video.id
                : video.id?.videoId || null;

              if (!vidId) return null;

              return (
                <div key={vidId} className="search-video-card">
                  <iframe
                    src={`https://www.youtube.com/embed/${vidId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={video.snippet.title}
                  ></iframe>
                  <p>{video.snippet.title}</p>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="vid-description">
          <p>{apiData.snippet.description.slice(0, 250)}</p>
          <hr />
          <h4>{value_converter(apiData.statistics.commentCount)} Comments</h4>

          {commentData.map((item, index) => {
            const comment = item.snippet.topLevelComment.snippet;
            return (
              <div key={index} className="comment">
                <img src={comment.authorProfileImageUrl || '/default-avatar.png'} alt="user" />
                <div>
                  <h3>
                    {comment.authorDisplayName}{' '}
                    <span>{moment(comment.publishedAt).fromNow()}</span>
                  </h3>
                  <p>{comment.textDisplay}</p>
                  <div className="comment-action">
                    <img src={like} alt="like" />
                    <span>{comment.likeCount}</span>
                    <img src={dislike} alt="dislike" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlayVideo;
