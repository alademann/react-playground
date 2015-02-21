/**
 * React Comments Box Tutorial
 */

var converter = new Showdown.converter();


/**
 * @class
 * Container for our comment box component(s)
 */
var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.commentUrl,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.commentUrl, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    // Optimistic update
    var comments = this.state.data;
    console.log(comments);
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});

    $.ajax({
      url: this.props.commentUrl,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.commentUrl, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []}
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="comment-box">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});


/**
 * @class
 * Single comment
 */
var Comment = React.createClass({
  render: function() {
    var rawCommentHtml = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="comment-author">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawCommentHtml}} />
      </div>
    );
  }
});


/**
 * @class
 * List of comments
 */
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });

    return (
      <div className="comment-list">
        {commentNodes}
      </div>
    );
  }
});


/**
 * @class
 * Form where a new comment can be added to the list
 */
var CommentForm = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();

    var $authorField = this.refs.commentAuthor.getDOMNode();
    var $textField   = this.refs.commentText.getDOMNode();

    var author = $authorField.value.trim();
    var text   = $textField.value.trim();

    if (!author || !text) {
      return;
    }

    this.props.onCommentSubmit({author: author, text: text});
    $authorField.value = '';
    $textField.value = '';
  },
  render: function() {
    return (
      <form className="comment-form" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="commentAuthor" />
        <input type="text" placeholder="Say something..." ref="commentText" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});


/**
 * @ignore
 * Instantiates the root component, starts the React framework,
 * and injects the markup into a raw DOM element (provided s the second argument)
 */
React.render(
  <CommentBox commentUrl="comments.json" pollInterval={2000} />,
  document.getElementById('content')
);
