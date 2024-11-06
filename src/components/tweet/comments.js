import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { postService } from "../../services/PostService";
import { PostComponent } from "../PostComponent";
import Loading from "../loading";

const Comments = (props) => {
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state.profile.user);
  const [isLoading, setIsLoading] = useState(false);

  const { slug } = useParams();
  const theme = useSelector((state) => state.theme);

  const refresh = useSelector((state) => state.update.refresh);
  const { tweet, isBookmark } = props;
  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 10,
  });

  const getComments = async (pagination, isFirstLoad) => {
    try {
      setIsLoading(true);
      const { success, data } = await postService.getComments(slug, pagination);
      if (success) {
        setIsLoading(false);
        if (isFirstLoad) {
          setComments(data.rows);
        } else {
          setComments([...comments, ...data.rows]);
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error retrieving comments:", error);
    }
  };

  useEffect(() => {
    const isFirstLoad = true;
    setPaginations({
      offset: 0,
      limit: 10,
    });
    setComments[0];
    getComments({ limit: 10, offset: 0 }, isFirstLoad);
  }, [slug, refresh]);

  useEffect(() => {
    if (comments.length > 0) {
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [comments]);

  const handleScroll = async () => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - 1;

    const isScrolledToBottom = windowHeight + scrollY >= documentHeight;
    const shouldLoadMore = isScrolledToBottom && !isLoading;
    const isFirstLoad = false;

    if (shouldLoadMore) {
      setIsLoading(true);
      setPaginations({
        limit,
        offset: offset + limit,
      });
      await getComments({ limit, offset: offset + 10 }, isFirstLoad);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  if (!comments) return <Loading />;

  if (isBookmark && !comments.length)
    return (
      <div style={{ textAlign: "center", padding: "40px 0px" }}>
        <h3 style={{ fontSize: "19px", fontWeight: 700, color: theme.color }}>
          You haven’t added any Tweets to your Bookmarks yet
        </h3>
        <p>When you do, they’ll show up here.</p>
      </div>
    );
  const toggleOpen = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleDelete = (slug) => {
    setComments(comments.filter((comment) => comment.slug !== slug));
  };

  return (
    <React.Fragment>
      {comments.map((comment, idx) => {
        const date = new Date(comment.createdAt);
        return (
          <React.Fragment key={idx}>
            <PostComponent
              isComment={true}
              tweet={comment}
              user={user}
              handleDelete={handleDelete}
              handleSelectPolicy={() => {}}
            />
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

export default Comments;
