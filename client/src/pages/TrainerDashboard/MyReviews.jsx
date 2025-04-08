import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Spinner, Card, Container } from "react-bootstrap";


function MyReviews() {
    const [reviews,setReviews]= useState([])
    const[ averageRating,setAverageRating]= useState(0)
    const [loading,setLoading]= useState(true)
    const token = localStorage.getItem("token")

    useEffect(()=>{
        fetchReviews()
    },[])
    const fetchReviews = async()=>{
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/trainer/myreviews`,
                {headers:{Authorization: `Bearer ${token}`}}
            )
            setReviews(response.data.reviews || [])
            setAverageRating(response.data.averageRating)
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }finally{
            setLoading(false)
        }
    }

    if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4 text-warning" />;
    
    return (
    
        <Container className="mt-4">
            <h3 className='text-dark text-center'>My Reviews</h3>
            <p className='text-center text-dark'>⭐ Average Rating: {averageRating}/5</p>

            {reviews.length === 0 ? (
                        <p className="text-white text-center">No reviews yet.</p>

            ) :(
               <div>
                {reviews.map((review)=>(
                    <Card key={review._id} className="mb-2 bg-dark text-white shadow=lg p-1">
                        <Card.Body>
                            <Card.Title>
                                <strong>{review.userId?.username}</strong>  ⭐ {review.rating}/5
                            </Card.Title>
                            <Card.Text>{review.comment}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
               </div> 
            )}
        </Container>
    
  )
}

export default MyReviews