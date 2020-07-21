import React from 'react';

interface VideoInfoProps {
};

interface VideoInfoState {
};

class VideoInfo extends React.Component<VideoInfoProps, VideoInfoState> {
  static defaultProps: VideoInfoProps = {

  };

  constructor(props: VideoInfoProps) {
    super(props);

  }

  componentDidMount() {

  }
/*
  render() {
    return (
      <div>
        <div className="media-object stack-for-small">
          <div className="media-object-section">
            <div className="author-img-sec">
              <div className="thumbnail author-single-post">
                <a href="#"><img src="images/post-author-post.png" alt="post"></a>
                <p className="text-center"><a href="#">Joseph John</a></p>
              </div>
            </div>
            <div className="media-object-section object-second">
              <div className="author-des clearfix">
                <div className="post-title">
                  <h4>There are many variations of passage.</h4>
                  <p>
                    <span><i className="fa fa-clock-o"></i>5 January 16</span>
                    <span><i className="fa fa-eye"></i>1,862K</span>
                    <span><i className="fa fa-thumbs-o-up"></i>1,862</span>
                    <span><i className="fa fa-thumbs-o-down"></i>180</span>
                    <span><i className="fa fa-commenting"></i>8</span>
                  </p>
                </div>
                <div className="subscribe">
                  <form method="post">
                    <button type="submit" name="subscribe">Subscribe</button>
                  </form>
                </div>
              </div>
              <div className="social-share">
                <div className="post-like-btn clearfix">
                  <form method="post">
                    <button type="submit" name="fav"><i className="fa fa-heart"></i>Add to</button>
                  </form>
                  <a href="#" className="secondary-button"><i className="fa fa-thumbs-o-up"></i></a>
                  <a href="#" className="secondary-button"><i className="fa fa-thumbs-o-down"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
*/
}


export default VideoInfo;
