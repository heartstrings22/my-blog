var marked = require('marked');
var Comment = require('./lib/mongo').Comment;

// 将comment 的 content从markdown转换成html
Comment.plugin('contentToHtml', {
	afterFind(comments) {
		return comments.map((comment) => {
			comment.content = marked(comment.content);
			return comment;
		});
	}
});

module.exports = {
	// 创建一个留言
	create(comment) {
		return Comment.create(comment).exec();
	},

	// 通过用户id和留言id删除一条留言
	delCommentById(commentId, author) {
		return Comment.remove({ author: author, _id: commentId }).exec();
	},

	// 通过文章id获取该文章下所有留言，按留言创建时间升序
	getComments(postId) {
		return Comment
			.find({ postId: postId})
			.populate({ path: 'author', model: 'User' })
			.sort({ _id: 1 })
			.addCreatedAt()
			.contentToHtml()
			.exec();
	},

	// 通过文章id获取该文章下留言数
	getCommentsCount(postId) {
		return Comment.count({ postId: postId }).exec();
	}
}