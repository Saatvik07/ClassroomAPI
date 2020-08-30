import React, { useEffect, useState } from "react";
import "./Course.css";
import { ShoelaceSpinner, ShoelaceCard } from "../ShoelaceComponents";
import { useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
function Course() {
	const { id } = useParams();
	const [courseWorkArray, setCourseWorkArray] = useState([]);
	const [loading, setLoading] = useState(<ShoelaceSpinner className='loader'></ShoelaceSpinner>);
	useEffect(() => {
		const fetchOptions = {
			method: "POST",
			headers: {
				"Content-Type": "Application/json",
			},
			body: JSON.stringify({ courseID: id }),
		};
		fetch("http://localhost:8080/api/auth/get_coursework", fetchOptions).then(async (response) => {
			if (response.ok) {
				const jsonResponse = await response.json();
				const socket = socketIOClient("http://localhost:8080");
				socket.emit("got-list", {
					courseworkList: jsonResponse.courseworkList,
					courseID: id,
				});
				socket.on("marks", (jsonString) => {
					const obj = jsonString;
					setLoading(null);
					setCourseWorkArray((prev) => {
						return [
							...prev,
							<ShoelaceCard className='course-card'>
								<div slot='header'>
									{obj.courseWorkTitle}
									<br />
									{obj.courseWorkDescription}
								</div>
								Grade: {obj.courseWorkGrade} / {obj.courseWorkMax}
								<div slot='footer'>Submitted : {obj.courseWorkLate ? "Late" : "On-Time"}</div>
							</ShoelaceCard>,
						];
					});
				});
			}
		});
	}, []);
	return (
		<div>
			{loading}
			{courseWorkArray}
		</div>
	);
}

export default Course;
