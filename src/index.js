document.addEventListener("DOMContentLoaded", function () {
    let initialLoad = true;
    getMovies();
    function getMovies() {
        fetch(`http://localhost:3000/films`)
            .then((response) => response.json())
            .then((films) => {
                console.log(films);
                showMovieDetails(films);
            })
            .catch((error) => console.error("Error fetching films:", error));
    }
    function showMovieDetails(films) {
        const allMovies = document.getElementById("list");
        films.forEach((movie, index) => {
            const list = document.createElement("li");
            list.textContent = movie.title;
            list.id = movie.id;
            list.addEventListener("click", seeMovieDetails);
            allMovies.appendChild(list);
            if (index === 0 && initialLoad) {
                listMovieDetails(movie.id);
            }
        });
    }
    function seeMovieDetails(event) {
        listMovieDetails(event.target.id);
    }
    function listMovieDetails(filmId) {
        fetch(`http://localhost:3000/films/${filmId}`)
            .then((response) => response.json())
            .then((movie) => {
                let movieListed = document.getElementById("movies");
                movieListed.innerHTML = `
                    <h2>${movie.title}</h2>
                    <img src="${movie.poster}" alt="${movie.title} Poster"/>
                    <p>${movie.description}</p>
                    <ul>
                        <li>RUNTIME: ${movie.runtime}</li>
                        <li>NUMBER OF SEATS: ${movie.capacity}</li>
                        <li>TIME: ${movie.showtime}</li>
                        <li>AVAILABLE TICKETS: ${movie.capacity - movie.tickets_sold}</li>
                        <li>BUY TICKET: <button id="buyTicketBtn">${movie.capacity === movie.tickets_sold ? 'SOLD OUT' : 'BUY TICKET'}</button></li>
                    </ul>`;
                let buyTicketBtn = document.getElementById("buyTicketBtn");
                // Add event listener to the "BUY TICKET" button
                buyTicketBtn.addEventListener("click", (event) => {
                    event.preventDefault()
                    buyTicket(movie.id, movie.capacity, movie.tickets_sold);
                });
            })
            .catch((error) => {
                console.error("Error fetching or displaying movie details:", error);
            });
    }
    function buyTicket(movieId, capacity, ticketsSold) {
        if (ticketsSold < capacity) {
            fetch(`http://localhost:3000/films/${movieId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tickets_sold: ticketsSold + 1,
                }),
            })
            .then(res => res.json())
            .then((updatedMovie) => {
                console.log('Tickets updated successfully:', updatedMovie);
                const availableTicketsElement = document.querySelector('filmId');
                availableTicketsElement.textContent = `AVAILABLE TICKETS: ${updatedMovie.capacity - updatedMovie.tickets_sold}`;
                const buyTicketBtn = document.getElementById("buyTicketBtn");
                buyTicketBtn.textContent = updatedMovie.capacity === updatedMovie.tickets_sold ? 'SOLD OUT' : 'BUY TICKET';
            })
            .catch((error) => {
                console.error("Error updating tickets:", error);
            });
        }
    }
});
