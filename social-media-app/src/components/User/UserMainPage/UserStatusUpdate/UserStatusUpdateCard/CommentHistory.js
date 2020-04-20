import React from "react";
import classes from './CommentHistory.module.css';

const CommentHistory = (props) => {

    return (
        <div>
            {
                props.comments.length > 0 ? 
                <div>
                    {
                        props.comments.map((item, key) => {
                            return (
                                <div key={key}>
                                    
                                    <div className={classes.Background}>
                                        <div>
                                            <span>
                                                <img 
                                                    className={classes.Img}
                                                    src={item.profilePicture} alt="profile"
                                                />
                                            </span>
                                            <span>
                                                <div className={classes.Name}>{item.firstName} {item.lastName}</div>
                                            </span>
                                        </div>
                                        
                                        <div>
                                            <div className={classes.Comment}>{item.comment}</div>
                                        </div>
                                        
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                :
                <div>No Comments</div>
            }
        </div>
                
    )
    
}

export default CommentHistory;