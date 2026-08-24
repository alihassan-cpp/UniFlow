/* =========================================================
   UNIFLOW V1
   APPLICATION JAVASCRIPT
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "uniflow_v1_data";


/* =========================================================
   DEFAULT DATA
   These are only sample courses/classes/tasks.
   Students can replace them with their own.
========================================================= */

const defaultData = {

    courses: [

        {
            id: "course-1",
            name: "Data Structures",
            code: "CS201",
            progress: 82
        },

        {
            id: "course-2",
            name: "COAL",
            code: "CS203",
            progress: 68
        },

        {
            id: "course-3",
            name: "Discrete Structures",
            code: "CS205",
            progress: 74
        }

    ],


    tasks: [

        {
            id: "task-1",
            name: "DSA Assignment",
            courseId: "course-1",
            due: "2026-08-25",
            done: false
        },

        {
            id: "task-2",
            name: "COAL Quiz",
            courseId: "course-2",
            due: "2026-08-25",
            done: false
        },

        {
            id: "task-3",
            name: "Discrete Homework",
            courseId: "course-3",
            due: "2026-08-26",
            done: false
        }

    ],


    classes: [

        {
            id: "class-1",
            courseId: "course-1",
            day: "Monday",
            start: "09:00",
            end: "10:30",
            room: "C-203",
            type: "Lecture"
        },

        {
            id: "class-2",
            courseId: "course-2",
            day: "Tuesday",
            start: "10:00",
            end: "11:30",
            room: "Lab 3",
            type: "Lab"
        },

        {
            id: "class-3",
            courseId: "course-3",
            day: "Tuesday",
            start: "12:00",
            end: "13:30",
            room: "B-104",
            type: "Lecture"
        },

        {
            id: "class-4",
            courseId: "course-1",
            day: "Thursday",
            start: "11:00",
            end: "12:30",
            room: "C-203",
            type: "Lecture"
        }

    ]

};


/* =========================================================
   GET DATA
========================================================= */

function getData() {

    const savedData =
        localStorage.getItem(STORAGE_KEY);


    if (!savedData) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultData)
        );

        return structuredClone(defaultData);
    }


    try {

        return JSON.parse(savedData);

    } catch (error) {

        console.error(
            "UniFlow data could not be loaded.",
            error
        );

        return structuredClone(defaultData);
    }

}


/* =========================================================
   SAVE DATA
========================================================= */

function saveData(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


/* =========================================================
   ESCAPE HTML
   Prevents user-entered text from being interpreted
   as HTML.
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/[&<>"']/g, function (character) {

            return {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            }[character];

        });

}


/* =========================================================
   COURSE NAME HELPER
========================================================= */

function getCourseName(data, courseId) {

    const course =
        data.courses.find(
            course => course.id === courseId
        );


    return course
        ? course.name
        : "Unknown course";

}


/* =========================================================
   MODAL FUNCTIONS
========================================================= */

function openModal(modalId) {

    const modal =
        document.getElementById(modalId);


    if (modal) {

        modal.classList.add("show");

    }

}


function closeModal(modalId) {

    const modal =
        document.getElementById(modalId);


    if (modal) {

        modal.classList.remove("show");

    }

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

window.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains("modal")
        ) {

            event.target.classList.remove("show");

        }

    }
);


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    const data = getData();


    /* -----------------------------------------
       NEXT CLASS
    ----------------------------------------- */

    const nextClassBox =
        document.getElementById("next-class");


    if (nextClassBox) {

        const nextClass =
            data.classes
                .slice()
                .sort(
                    (a, b) =>
                        a.start.localeCompare(b.start)
                )[0];


        if (nextClass) {

            nextClassBox.innerHTML = `

                <div>

                    <small>
                        NEXT CLASS
                    </small>

                    <h2>
                        ${escapeHTML(
                            getCourseName(
                                data,
                                nextClass.courseId
                            )
                        )}
                    </h2>

                    <p>
                        ${nextClass.start}
                        —
                        ${nextClass.end}

                        ·

                        ${escapeHTML(
                            nextClass.room
                        )}
                    </p>

                </div>


                <span class="status">

                    Upcoming →

                </span>

            `;

        } else {

            nextClassBox.innerHTML = `

                <div>

                    <small>
                        NEXT CLASS
                    </small>

                    <h2>
                        No classes added
                    </h2>

                    <p>
                        Add your weekly classes
                        from Timetable.
                    </p>

                </div>

            `;

        }

    }


    /* -----------------------------------------
       TASK COUNT
    ----------------------------------------- */

    const taskCount =
        document.getElementById("task-count");


    const remainingTasks =
        data.tasks.filter(
            task => !task.done
        );


    if (taskCount) {

        if (remainingTasks.length === 0) {

            taskCount.textContent =
                "All tasks complete 🎉";

        } else {

            taskCount.textContent =
                `${remainingTasks.length}
                 ${remainingTasks.length === 1
                    ? "task"
                    : "tasks"}`;

        }

    }


    /* -----------------------------------------
       DASHBOARD TASKS
    ----------------------------------------- */

    const dashboardTasks =
        document.getElementById(
            "dashboard-tasks"
        );


    if (dashboardTasks) {

        if (data.tasks.length === 0) {

            dashboardTasks.innerHTML = `

                <p class="muted">

                    No tasks yet.

                </p>

            `;

        } else {

            dashboardTasks.innerHTML =
                data.tasks
                    .slice(0, 5)
                    .map(function (task) {

                        return `

                            <div
                                class="task-row"
                                onclick="
                                    toggleTask('${task.id}')
                                "
                            >

                                <span
                                    class="
                                        check
                                        ${task.done
                                            ? "done"
                                            : ""}
                                    "
                                >

                                    ${task.done
                                        ? "✓"
                                        : ""}

                                </span>


                                <div>

                                    <b>

                                        ${escapeHTML(
                                            task.name
                                        )}

                                    </b>


                                    <small>

                                        ${escapeHTML(
                                            getCourseName(
                                                data,
                                                task.courseId
                                            )
                                        )}

                                        ·

                                        ${
                                            task.done
                                                ? "Completed"
                                                : "Due " +
                                                  (
                                                      task.due ||
                                                      "soon"
                                                  )
                                        }

                                    </small>

                                </div>

                            </div>

                        `;

                    })
                    .join("");

        }

    }


    /* -----------------------------------------
       COURSE PROGRESS
    ----------------------------------------- */

    const dashboardCourses =
        document.getElementById(
            "dashboard-courses"
        );


    if (dashboardCourses) {

        if (data.courses.length === 0) {

            dashboardCourses.innerHTML = `

                <p class="muted">

                    No courses added yet.

                </p>

            `;

        } else {

            dashboardCourses.innerHTML =
                data.courses
                    .map(function (course) {

                        return `

                            <div
                                class="course-progress"
                            >

                                <div
                                    class="course-line"
                                >

                                    <span>

                                        ${escapeHTML(
                                            course.name
                                        )}

                                    </span>


                                    <b>

                                        ${course.progress}%

                                    </b>

                                </div>


                                <div class="bar">

                                    <i
                                        style="
                                            width:
                                            ${course.progress}%
                                        "
                                    ></i>

                                </div>

                            </div>

                        `;

                    })
                    .join("");

        }

    }


    /* -----------------------------------------
       SCHEDULE
    ----------------------------------------- */

    const todaySchedule =
        document.getElementById(
            "today-schedule"
        );


    if (todaySchedule) {

        if (data.classes.length === 0) {

            todaySchedule.innerHTML = `

                <p class="muted">

                    No classes added yet.

                </p>

            `;

        } else {

            todaySchedule.innerHTML =
                data.classes
                    .slice()
                    .sort(
                        (a, b) =>
                            a.start.localeCompare(
                                b.start
                            )
                    )
                    .slice(0, 6)
                    .map(function (classItem) {

                        return `

                            <div
                                class="schedule-row"
                            >

                                <b>

                                    ${classItem.start}

                                </b>


                                <div>

                                    <strong>

                                        ${escapeHTML(
                                            getCourseName(
                                                data,
                                                classItem.courseId
                                            )
                                        )}

                                    </strong>


                                    <small>

                                        ${escapeHTML(
                                            classItem.type
                                        )}

                                        ·

                                        ${escapeHTML(
                                            classItem.room
                                        )}

                                    </small>

                                </div>

                            </div>

                        `;

                    })
                    .join("");

        }

    }

}


/* =========================================================
   TASKS
========================================================= */

function renderTasks() {

    const data = getData();


    const taskList =
        document.getElementById(
            "task-list"
        );


    if (!taskList) {

        return;

    }


    /* Remaining count */

    const remaining =
        data.tasks.filter(
            task => !task.done
        ).length;


    const pageCount =
        document.getElementById(
            "tasks-page-count"
        );


    if (pageCount) {

        if (remaining === 0) {

            pageCount.textContent =
                "All tasks complete 🎉";

        } else {

            pageCount.textContent =
                `${remaining}
                 ${remaining === 1
                    ? "task"
                    : "tasks"}`;

        }

    }


    /* Empty state */

    if (data.tasks.length === 0) {

        taskList.innerHTML = `

            <p class="muted">

                No tasks yet.
                Click "+ Add task" to create one.

            </p>

        `;

        return;

    }


    /* Render tasks */

    taskList.innerHTML =
        data.tasks
            .map(function (task) {

                return `

                    <div
                        class="task-row task-page-row"
                    >


                        <span
                            class="
                                check
                                ${task.done
                                    ? "done"
                                    : ""}
                            "

                            onclick="
                                toggleTask('${task.id}')
                            "
                        >

                            ${task.done
                                ? "✓"
                                : ""}

                        </span>


                        <div>

                            <b>

                                ${escapeHTML(
                                    task.name
                                )}

                            </b>


                            <small>

                                ${escapeHTML(
                                    getCourseName(
                                        data,
                                        task.courseId
                                    )
                                )}

                                ·

                                ${
                                    task.due
                                        ? task.due
                                        : "No due date"
                                }

                            </small>

                        </div>


                        <button
                            class="delete"

                            onclick="
                                deleteTask(
                                    '${task.id}'
                                )
                            "
                        >

                            Delete

                        </button>


                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   TOGGLE TASK
========================================================= */

function toggleTask(taskId) {

    const data = getData();


    const task =
        data.tasks.find(
            task => task.id === taskId
        );


    if (!task) {

        return;

    }


    task.done =
        !task.done;


    saveData(data);


    /* Refresh dashboard */

    if (
        document.getElementById(
            "dashboard-tasks"
        )
    ) {

        renderDashboard();

    }


    /* Refresh tasks page */

    if (
        document.getElementById(
            "task-list"
        )
    ) {

        renderTasks();

    }

}


/* =========================================================
   ADD TASK
========================================================= */

function addTask(event) {

    event.preventDefault();


    const data = getData();


    const name =
        document.getElementById(
            "task-name"
        ).value.trim();


    const courseId =
        document.getElementById(
            "task-course"
        ).value;


    const due =
        document.getElementById(
            "task-due"
        ).value;


    if (!name || !courseId) {

        return;

    }


    const newTask = {

        id:
            "task-" +
            Date.now(),

        name:
            name,

        courseId:
            courseId,

        due:
            due,

        done:
            false

    };


    data.tasks.push(newTask);


    saveData(data);


    closeModal("task-modal");


    event.target.reset();


    renderTasks();

}


/* =========================================================
   DELETE TASK
========================================================= */

function deleteTask(taskId) {

    const data = getData();


    data.tasks =
        data.tasks.filter(
            task =>
                task.id !== taskId
        );


    saveData(data);


    renderTasks();

}


/* =========================================================
   COURSES
========================================================= */

function renderCourses() {

    const data = getData();


    const courseList =
        document.getElementById(
            "course-list"
        );


    if (!courseList) {

        return;

    }


    /* Empty state */

    if (data.courses.length === 0) {

        courseList.innerHTML = `

            <div class="card">

                <p class="muted">

                    You have no courses yet.

                    Click "+ Add course"
                    to create your first course.

                </p>

            </div>

        `;

        return;

    }


    /* Render courses */

    courseList.innerHTML =
        data.courses
            .map(function (course) {

                return `

                    <article
                        class="course-card"
                    >


                       <div
    class="course-top"
>

    <span
        class="course-code"
    >

        ${escapeHTML(
            course.code ||
            "COURSE"
        )}

    </span>


    <div class="course-actions">

        <button
            class="edit"
            onclick="
                editCourse(
                    '${course.id}'
                )
            "
        >

            Edit

        </button>


        <button
            class="delete"

            onclick="
                deleteCourse(
                    '${course.id}'
                )
            "
        >

            Delete

        </button>

    </div>

</div>


                        <h2>

                            ${escapeHTML(
                                course.name
                            )}

                        </h2>


                        <p>

                            Semester course

                        </p>


                        <div
                            class="
                                course-progress
                            "
                        >

                            <div
                                class="course-line"
                            >

                                <span>
                                    Progress
                                </span>


                                <b>

                                    ${course.progress}%

                                </b>

                            </div>


                            <div class="bar">

                                <i
                                    style="
                                        width:
                                        ${course.progress}%
                                    "
                                ></i>

                            </div>

                        </div>


                    </article>

                `;

            })
            .join("");

}


/* =========================================================
   ADD COURSE
========================================================= */

function addCourse(event) {

    event.preventDefault();


    const data = getData();


    const name =
        document.getElementById(
            "course-name"
        ).value.trim();


    const code =
        document.getElementById(
            "course-code"
        ).value.trim();


    const progress =
        Number(
            document.getElementById(
                "course-progress"
            ).value
        ) || 0;


    if (!name) {

        return;

    }


    const newCourse = {

        id:
            "course-" +
            Date.now(),

        name:
            name,

        code:
            code,

        progress:
            Math.min(
                100,
                Math.max(
                    0,
                    progress
                )
            )

    };


    data.courses.push(
        newCourse
    );


    saveData(data);


    closeModal(
        "course-modal"
    );


    event.target.reset();


    renderCourses();

}


/* =========================================================
   DELETE COURSE
   Also removes its classes and tasks.
========================================================= */

function deleteCourse(courseId) {

    const data = getData();


    const course =
        data.courses.find(
            course =>
                course.id === courseId
        );


    if (!course) {

        return;

    }


    const confirmed =
        confirm(
            `Delete "${course.name}"?

This will also remove its
tasks and timetable classes.`
        );


    if (!confirmed) {

        return;

    }


    data.courses =
        data.courses.filter(
            course =>
                course.id !== courseId
        );


    data.tasks =
        data.tasks.filter(
            task =>
                task.courseId !== courseId
        );


    data.classes =
        data.classes.filter(
            classItem =>
                classItem.courseId !== courseId
        );


    saveData(data);


    renderCourses();

}


/* =========================================================
   COURSE DROPDOWN
========================================================= */

function populateCourseSelect(selectId) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) {

        return;

    }


    const data = getData();


    if (data.courses.length === 0) {

        select.innerHTML = `

            <option value="">

                No courses available

            </option>

        `;

        return;

    }


    select.innerHTML =
        data.courses
            .map(function (course) {

                return `

                    <option
                        value="${course.id}"
                    >

                        ${escapeHTML(
                            course.name
                        )}

                    </option>

                `;

            })
            .join("");

}


/* =========================================================
   TIMETABLE
========================================================= */

function renderTimetable() {

    const data = getData();


    const timetable =
        document.getElementById(
            "timetable-grid"
        );


    if (!timetable) {

        return;

    }


    const days = [

        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"

    ];


    timetable.innerHTML =
        days
            .map(function (day) {


                const classes =
                    data.classes
                        .filter(
                            classItem =>
                                classItem.day === day
                        )
                        .sort(
                            (a, b) =>
                                a.start.localeCompare(
                                    b.start
                                )
                        );


                let classHTML = "";


                if (classes.length === 0) {

                    classHTML = `

                        <div class="empty-day">

                            Free

                        </div>

                    `;

                } else {


                    classHTML =
                        classes
                            .map(function (
                                classItem
                            ) {

                                return `

                                    <div
                                        class="
                                            class-card
                                        "
                                    >


                                        <small>

                                            ${classItem.start}
                                            —
                                            ${classItem.end}

                                        </small>


                                        <b>

                                            ${escapeHTML(
                                                getCourseName(
                                                    data,
                                                    classItem.courseId
                                                )
                                            )}

                                        </b>


                                        <span>

                                            ${escapeHTML(
                                                classItem.room
                                            )}

                                            ·

                                            ${escapeHTML(
                                                classItem.type
                                            )}

                                        </span>


                                        <button

                                            onclick="
                                                deleteClass(
                                                    '${classItem.id}'
                                                )
                                            "

                                            aria-label="
                                                Delete class
                                            "
                                        >

                                            ×

                                        </button>


                                    </div>

                                `;

                            })
                            .join("");

                }


                return `

                    <div
                        class="day-column"
                    >


                        <div
                            class="day-title"
                        >

                            ${day}

                        </div>


                        ${classHTML}


                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   ADD CLASS
========================================================= */

function addClass(event) {

    event.preventDefault();


    const data = getData();


    const courseId =
        document.getElementById(
            "class-course"
        ).value;


    const day =
        document.getElementById(
            "class-day"
        ).value;


    const start =
        document.getElementById(
            "class-start"
        ).value;


    const end =
        document.getElementById(
            "class-end"
        ).value;


    const room =
        document.getElementById(
            "class-room"
        ).value.trim();


    const type =
        document.getElementById(
            "class-type"
        ).value;


    if (
        !courseId ||
        !day ||
        !start ||
        !end
    ) {

        return;

    }


    /* Prevent invalid time range */

    if (start >= end) {

        alert(
            "End time must be after start time."
        );

        return;

    }


    const newClass = {

        id:
            "class-" +
            Date.now(),

        courseId:
            courseId,

        day:
            day,

        start:
            start,

        end:
            end,

        room:
            room || "Room not specified",

        type:
            type

    };


    data.classes.push(
        newClass
    );


    saveData(data);


    closeModal(
        "class-modal"
    );


    event.target.reset();


    renderTimetable();

}


/* =========================================================
   DELETE CLASS
========================================================= */

function deleteClass(classId) {

    const data = getData();


    data.classes =
        data.classes.filter(
            classItem =>
                classItem.id !== classId
        );


    saveData(data);


    renderTimetable();

}


/* =========================================================
   WEEK NAVIGATION
========================================================= */

let currentWeekOffset = 0;


function changeWeek(direction) {

    currentWeekOffset += direction;


    /*
        V1 uses a single weekly schedule.

        The offset is currently visual only.

        Later, when UniFlow gets a backend,
        this can be connected to real dates.
    */


    const weekTitle =
        document.querySelector(
            ".week-head h2"
        );


    if (!weekTitle) {

        return;

    }


    if (currentWeekOffset === 0) {

        weekTitle.textContent =
            "This week";

    } else if (
        currentWeekOffset === 1
    ) {

        weekTitle.textContent =
            "Next week";

    } else if (
        currentWeekOffset === -1
    ) {

        weekTitle.textContent =
            "Previous week";

    } else if (
        currentWeekOffset > 1
    ) {

        weekTitle.textContent =
            `Week +${currentWeekOffset}`;

    } else {

        weekTitle.textContent =
            `Week ${currentWeekOffset}`;

    }

}


/* =========================================================
   KEYBOARD SUPPORT
   ESC closes open modal.
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {

            return;

        }


        document
            .querySelectorAll(".modal.show")
            .forEach(function (modal) {

                modal.classList.remove(
                    "show"
                );

            });

    }
);

/* =========================================================
   LANDING PAGE DASHBOARD PREVIEW
========================================================= */

function renderLandingPreview() {

    const data = getData();

    /* NEXT CLASS */

    const nextClass =
        data.classes
            .slice()
            .sort(
                (a, b) =>
                    a.start.localeCompare(b.start)
            )[0];

    const nextClassName =
        document.getElementById(
            "preview-next-class"
        );

    const nextClassDetails =
        document.getElementById(
            "preview-next-details"
        );

    if (nextClass) {

        if (nextClassName) {

            nextClassName.textContent =
                getCourseName(
                    data,
                    nextClass.courseId
                );

        }

        if (nextClassDetails) {

            nextClassDetails.textContent =
                `${nextClass.start} · ${nextClass.room}`;

        }

    } else {

        if (nextClassName) {

            nextClassName.textContent =
                "No classes added";

        }

        if (nextClassDetails) {

            nextClassDetails.textContent =
                "Add classes from Timetable";

        }

    }


    /* TASKS */

    const remainingTasks =
        data.tasks.filter(
            task => !task.done
        );

    const taskCount =
        document.getElementById(
            "preview-task-count"
        );

    if (taskCount) {

        taskCount.textContent =
            `${remainingTasks.length} ${
                remainingTasks.length === 1
                    ? "task"
                    : "tasks"
            }`;

    }


    const task1 =
        document.getElementById(
            "preview-task-1"
        );

    const task2 =
        document.getElementById(
            "preview-task-2"
        );


    if (remainingTasks[0]) {

        task1.textContent =
            `○ ${remainingTasks[0].name}`;

    } else {

        task1.textContent =
            "✓ All tasks complete";

    }


    if (remainingTasks[1]) {

        task2.textContent =
            `○ ${remainingTasks[1].name}`;

    } else {

        task2.textContent =
            "";

    }


    /* COURSE PROGRESS */

    const progressCourse =
        data.courses[0];

    const progress =
        document.getElementById(
            "preview-progress"
        );

    const progressBar =
        document.getElementById(
            "preview-progress-bar"
        );

    const progressCourseName =
        document.getElementById(
            "preview-progress-course"
        );


    if (progressCourse) {

        if (progress) {

            progress.textContent =
                `${progressCourse.progress}%`;

        }

        if (progressBar) {

            progressBar.style.width =
                `${progressCourse.progress}%`;

        }

        if (progressCourseName) {

            progressCourseName.textContent =
                progressCourse.name;

        }

    } else {

        if (progress) {

            progress.textContent =
                "0%";

        }

        if (progressBar) {

            progressBar.style.width =
                "0%";

        }

        if (progressCourseName) {

            progressCourseName.textContent =
                "No courses yet";

        }

    }

}

/* =========================================================
   EDIT COURSE
========================================================= */

let editingCourseId = null;


function editCourse(courseId) {

    const data = getData();


    const course =
        data.courses.find(
            course =>
                course.id === courseId
        );


    if (!course) {

        return;

    }


    editingCourseId = courseId;


    document.getElementById(
        "course-name"
    ).value = course.name;


    document.getElementById(
        "course-code"
    ).value = course.code || "";


    document.getElementById(
        "course-progress"
    ).value = course.progress;


    const modal =
        document.getElementById(
            "course-modal"
        );


    const title =
        modal.querySelector(
            "h2"
        );


    const description =
        modal.querySelector(
            ".modal-description"
        );


    const submitButton =
        modal.querySelector(
            "button[type='submit']"
        );


    title.textContent =
        "Edit course";


    description.textContent =
        "Update your course information and progress.";


    submitButton.textContent =
        "Save changes";


    openModal(
        "course-modal"
    );

}


/* =========================================================
   COURSE FORM HANDLER
   Handles both adding and editing courses.
========================================================= */

function handleCourseSubmit(event) {

    event.preventDefault();


    const data = getData();


    const name =
        document.getElementById(
            "course-name"
        ).value.trim();


    const code =
        document.getElementById(
            "course-code"
        ).value.trim();


    const progress =
        Math.min(
            100,
            Math.max(
                0,
                Number(
                    document.getElementById(
                        "course-progress"
                    ).value
                ) || 0
            )
        );


    /* -----------------------------------------
       EDIT EXISTING COURSE
    ----------------------------------------- */

    if (editingCourseId) {

        const course =
            data.courses.find(
                course =>
                    course.id ===
                    editingCourseId
            );


        if (!course) {

            return;

        }


        course.name =
            name;

        course.code =
            code;

        course.progress =
            progress;


        saveData(data);


        editingCourseId =
            null;


        closeModal(
            "course-modal"
        );


        event.target.reset();


        resetCourseModal();


        renderCourses();


        return;

    }


    /* -----------------------------------------
       ADD NEW COURSE
    ----------------------------------------- */

    if (!name) {

        return;

    }


    const newCourse = {

        id:
            "course-" +
            Date.now(),

        name:
            name,

        code:
            code,

        progress:
            progress

    };


    data.courses.push(
        newCourse
    );


    saveData(data);


    closeModal(
        "course-modal"
    );


    event.target.reset();


    renderCourses();

}


/* =========================================================
   RESET COURSE MODAL
========================================================= */

function resetCourseModal() {

    editingCourseId =
        null;


    const modal =
        document.getElementById(
            "course-modal"
        );


    if (!modal) {

        return;

    }


    const title =
        modal.querySelector(
            "h2"
        );


    const description =
        modal.querySelector(
            ".modal-description"
        );


    const submitButton =
        modal.querySelector(
            "button[type='submit']"
        );


    title.textContent =
        "Add a course";


    description.textContent =
        "Add a subject from your current semester.";


    submitButton.textContent =
        "Add course";

}