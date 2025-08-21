import React, { useEffect, useState, useMemo } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import { API_KEY, value_converter } from '../../data';
import VideoSkeleton from '../VideoSkeleton/VideoSkeleton';
import moment from 'moment';

const PlayVideo = ({ videoId, searchTerm }) => {
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    const fetchVideoData = async () => {
      const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
      const res = await fetch(videoDetails_url);
      const data = await res.json();
      setApiData(data.items?.[0] || null);
      window.scrollTo(0, 0);
    };

    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    const fetchOtherData = async () => {
      if (!apiData?.snippet?.channelId) return;
      if (!videoId || typeof videoId !== 'string' || videoId.length !== 11) {
        console.warn('Invalid videoId for related fetch:', videoId);
        return;
      }

      try {
        const channelLogo_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        const channelRes = await fetch(channelLogo_url);
        const channelData = await channelRes.json();
        setChannelData(channelData.items?.[0] || null);

        const videoComment_url = `https://www.googleapis.com/youtube/v3/commentThreads?textFormat=plainText&part=snippet&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
        const commentRes = await fetch(videoComment_url);
        const commentData = await commentRes.json();
        setCommentData(commentData.items?.filter(item => item?.snippet?.topLevelComment?.snippet) || []);

        const related_url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=20&key=${API_KEY}`;
        const relatedRes = await fetch(related_url);
        const relatedData = await relatedRes.json();
        setRelatedVideos(relatedData.items || []);
      } catch (err) {
        console.error('Error fetching additional video data:', err);
      }
    };

    fetchOtherData();
  }, [apiData]);

  const filteredSuggestions = useMemo(() => {
    if (typeof searchTerm !== 'string' || !searchTerm.trim()) return [];
    if (!Array.isArray(relatedVideos)) return [];
    return relatedVideos.filter(video =>
      video.snippet?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, relatedVideos]);

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
          <span>
            <img src={like} alt="like" />
            {value_converter(apiData.statistics.likeCount)}
          </span>
          <span>
            <img src={dislike} alt="dislike" />
            2
          </span>
          <span>
            <img src={share} alt="share" />
            Share
          </span>
          <span>
            <img src={save} alt="save" />
            Save
          </span>
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
              : '1M'}{' '}
            Subscribers
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
              const vidId = (() => {
                if (typeof video.id === 'string') return video.id;
                if (typeof video.id === 'object' && typeof video.id.videoId === 'string') return video.id.videoId;
                return null;
              })();

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
