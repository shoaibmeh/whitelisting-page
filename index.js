AOS.init();
const URL = "https://api-demo-rec.botnosticsolutions.ai/api";
const FE_URL = "https://demo-rec.botnosticsolutions.ai"
const company_code = 'DC003'

// function to toggle between jobs detaill
function handleJobDetailsDiv(handling_id) {
    var div = document.getElementById(handling_id);
    if (div.style.display === 'none') {
        div.style.display = 'block';
    } else {
        div.style.display = 'none';
    }
}
// navbar color while scroll
function stickyHeader() {
    let header = document.getElementById('bg_light')

    if (window.scrollY > 700) {
        header.style.position = "fixed"
        header.style.background = "linear-gradient(41deg, #232F3E, #1e3755)"
        header.style.left = "0"
        header.style.top = "0"
        header.style.zIndex = "99999999"
    }
    else {
        header.style.background = "transparent"
    }

}
window.addEventListener('scroll', stickyHeader)


// function which call on signUp form

function registerform(event) {

    event.preventDefault();

    let mobile_no
    let default_mobile_no = 12345678910
    let email = document.getElementById('rec_reg_email').value;
    let cnic_no = document.getElementById('rec_reg_cnic').value;
    let company_code = document.getElementById('company_code').value
    if (document.getElementById('rec_reg_contact_no').value === "") {
        mobile_no = default_mobile_no
    }
    else {
        mobile_no = document.getElementById('rec_reg_contact_no').value;
    }

    let password = document.getElementById('rec_reg_password').value;
    let confirm_password = document.getElementById('rec_reg_confirm_passoword').value;
    let country = document.getElementById('rec_country_id').value;
    let state = document.getElementById('rec_state_id').value;
    let city = document.getElementById('rec_city_id').value;
    let source = document.getElementById('rec_source_id').value;
    let alert_box = document.getElementById('reg_alert_box')
    let failure_box = document.getElementById('failure_alert');
    let failure_resume_box = document.getElementById('failure_resume_alert');


    document.getElementById("register_submit").setAttribute("value", "Please wait!");
    document.getElementById("register_submit").style.cursor = "wait"
    document.getElementById("register_submit").setAttribute("disabled", "disabled")

    // console.log("Email ch: ",email)
    let file = document.getElementById('file').value;

    let formData = null;
    if (file !== '') {
        const fileInput = document.querySelector("input[name='cv_uploading']");
        formData = new FormData()
        formData.append('file', fileInput.files[0])
    }


    if (password !== confirm_password) {
        document.getElementById('failure_text_pwd').style.display = "block"
        document.getElementById('reg_confirm_passoword_border').style.borderBottomColor = "red"
    }
    else {
        // document.getElementById('failure_text_pwd').style.display = "none"
        document.getElementById('reg_confirm_passoword_border').style.borderBottomColor = "rgb(198, 198, 198)"
        let data = {
            email: email,
            password: password,
            contact_no: mobile_no,
            country: country,
            state: state,
            city: city,
            cnic_no: cnic_no,
            source: source,
            company_code: company_code

        }
        showLoader("Wait...")
        let http = new Http();
        http.makeRequest('POST', `${URL}/recruitment/register`, data)
            .then(async function (response) {
                res = JSON.parse(response)

                document.getElementById("register_submit").setAttribute("value", "Sign Up");
                document.getElementById("register_submit").style.cursor = "pointer"
                document.getElementById("register_submit").disabled = false;

                if (res.success == true) {
                    if (file !== '') {
                        const file_to_upload = await http.makeRequestFile('POST', `${URL}/resume-upload?email=${email}`, formData)
                            .then(function (response_resume) {
                                res_resume = JSON.parse(response_resume)

                                if (res_resume.success === true) {
                                    // alert_box.style.display = "block"
                                    Swal.fire({
                                        icon: 'success',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                    document.getElementById('login_form').style.display = "block";
                                    document.getElementById('register_form').style.display = "none"
                                }
                                else {
                                    // failure_box.style.display = "block"
                                    Swal.fire({
                                        title: 'Error!',
                                        text: 'Something went wrong.',
                                        icon: 'error',
                                        confirmButtonText: 'OK'
                                    })
                                }


                            }, error => {
                                // failure_resume_box.style.display = "block"
                                Swal.fire({
                                    title: 'You have successfully been registered',
                                    text: "but your resume did not upload properly. Please log in with your email and password and upload your resume again.",
                                    icon: 'success',
                                    confirmButtonText: 'OK',
                                    confirmButtonColor: "#232F3E",
                                })
                                document.getElementById('login_form').style.display = "block";
                                document.getElementById('register_form').style.display = "none"
                            })
                    }
                    else {
                        // alert_box.style.display = "block"
                        Swal.fire({
                            icon: 'success',
                            title: 'Thanks for signing up!',
                            confirmButtonColor: "#232F3E",
                            timer: 1500
                        })
                        document.getElementById('login_form').style.display = "block";
                        document.getElementById('register_form').style.display = "none"
                    }


                }
                else {
                    // failure_box.style.display = "block"


                    if (res.data[0]) {
                        Swal.fire({
                            title: 'Error!',
                            text: "Please check if this company exists",
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: "#232F3E",

                        })
                    }
                    else {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Something went wrong.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: "#232F3E",

                        })
                    }


                }
            })
    }

    document.getElementById("register_submit").setAttribute("value", "Sign Up");
    document.getElementById("register_submit").style.cursor = "pointer"
    document.getElementById("register_submit").disabled = false;

}

// CLOSE MODAL AFTER LOGIN/REGISTER 
function closeModal() {
    document.getElementById("modal").style.display = "none";
}


// function define to read json file
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

window.addEventListener('DOMContentLoaded', (event) => {
    readTextFile("./assets/csc.json", function (text) {
        var data = JSON.parse(text);
        let countryElem = document.getElementById('rec_country_id');
        countryElem.innerHTML = "";
        countryElem.innerHTML += `<option value="Pakistan" selected>Pakistan</option>`;

        // Trigger state and city population for Pakistan
        
        handleRecCountryChange({ target: { value: 'Pakistan' } });
    });
});
function handleCountryChange(event) {
    let counntry_name = event.target.value;
    readTextFile("./assets/csc.json", function (text) {
        var data = JSON.parse(text);
        let state_name = Object.keys(data[counntry_name]);
        let stateElem = document.getElementById('state_id');
        stateElem.innerHTML = ""
        state_name.map(state => {
            stateElem.innerHTML += `<option value="${state}">${state}</option>`
        })
        document.querySelector(`select[name='state']`).options[0].innerText = "Select State.."
    })
}

function handleRecCountryChange(event) {
    // console.log("Rec State: ",event)
    let counntry_name = event.target.value;
    readTextFile("./assets/csc.json", function (text) {
        var data = JSON.parse(text);
        let rec_state_name = Object.keys(data[counntry_name]);
        let rec_stateElem = document.getElementById('rec_state_id');
        // console.log("Reccc State: ",rec_stateElem)
        rec_stateElem.innerHTML = ""
        rec_state_name.map(state => {
            rec_stateElem.innerHTML += `<option value="${state}">${state}</option>`
        })
        document.querySelector(`select[name='rec_state']`).options[0].innerText = "Select State.."
    })
}

function handleRecStateChange(event) {
    let country_name = document.getElementById('rec_country_id').value;
    let rec_state_name = event.target.value;
    readTextFile("./assets/csc.json", function (text) {
        var data = JSON.parse(text);
        let rec_city_in_states = data[country_name][rec_state_name]
        let rec_cityElem = document.getElementById('rec_city_id');
        rec_cityElem.innerHTML = ""
        rec_city_in_states.map(city => {
            rec_cityElem.innerHTML += `<option value="${city}">${city}</option>`
        })
        // document.querySelector(`select[name='city']`).options[0].innerText ="Select City.."
    })
}



function handleStateChange(event) {
    let country_name = document.getElementById('country_id').value;
    let state_name = event.target.value;
    readTextFile("./assets/csc.json", function (text) {
        var data = JSON.parse(text);
        let city_in_states = data[country_name][state_name]
        let cityElem = document.getElementById('city_id');
        cityElem.innerHTML = ""
        city_in_states.map(city => {
            cityElem.innerHTML += `<option value="${city}">${city}</option>`
        })
        // document.querySelector(`select[name='city']`).options[0].innerText ="Select City.."
    })
}

function validatePassword(event) {
    if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(event.target.value)) {
        document.getElementById("error-pwd-format").style.display = "none";
        document.getElementById("rec_reg_password").style.border = "none";

    }
    else {
        document.getElementById("error-pwd-format").textContent =
            "Must contain 8 characters including 1 uppercase, 1 lowercase,1 number and 1 special case character.";
        document.getElementById("rec_reg_password").style.borderColor = "red";
    }
    const confirm_pass = document.getElementById(
        "rec_reg_confirm_passoword"
    ).value;
    if (confirm_pass !== "") {
        matchPassword({ target: { value: confirm_pass } });
    }
}

function ValidateEmail(event) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value)) {
        document.getElementById("error-email").textContent = "";
        document.getElementById("rec_reg_email").style.border = "none";
    }
    else {
        document.getElementById("error-email").textContent = "Invalid Email Format";
        document.getElementById("rec_reg_email").style.borderColor = "red";
    }
}

function matchPassword(event) {
    const pass = document.getElementById("rec_reg_password").value
    const confirm_pass = event.target.value
    if (confirm_pass === pass) {
        document.getElementById("error-pwd").textContent = "";
        document.getElementById("rec_reg_confirm_passoword").style.border = "none";
    }
    else {
        document.getElementById("error-pwd").textContent = "Password doesn't match";
        // document.getElementById("rec_reg_confirm_passoword").style.borderColor = "red";
    }
}
// Open Login and Register Form When User Click on Login and Register Button
function openRegisterForm() {
    document.getElementById('login_form').style.display = "none";
    document.getElementById('register_form').style.display = "block"
    // let register_tab = document.getElementById('register_tab')
    // let login_tab = document.getElementById('login_tab')
    // register_tab.style.color = "white";
    // register_tab.style.background = "#330867"
    // login_tab.style.background = "white"
    // login_tab.style.color = "#330867"
    // login_tab.style.borderColor = "#330867"
}
function openLoginForm() {
    document.getElementById('login_form').style.display = "block";
    document.getElementById('register_form').style.display = "none"
    // let register_tab = document.getElementById('register_tab')
    // let login_tab = document.getElementById('login_tab')
    // login_tab.style.color = "white";
    // login_tab.style.background = "#330867"
    // register_tab.style.background = "white"
    // register_tab.style.color = "#330867"
    // register_tab.style.borderColor = "#330867"
}

function showLoader(props) {
    Swal.fire({
        title: props,
    });
    Swal.showLoading();
}

// Call Login Api to Login Existing User and Redirect in to Chat Page
function loginform(event) {
    event.preventDefault();
    showLoader("Wait...")
    let email = document.getElementById('login_email').value;
    let password = document.getElementById('login_password').value;
    let company_code = document.getElementById('login_company_code').value
    let alert_box = document.getElementById('log_alert_box')
    let failure_box = document.getElementById('failure_alert');
    let loading = document.getElementById('loading_api');
    let login_submit = document.getElementById('login_submit');
    loading.style.display = "block"
    login_submit.style.display = "none"
    // alert_box.style.display="none"
    let token
    let path_name
    let country
    let permission_consent, profile_picture;
    let data = {
        email: email,
        password: password,
        company_code: company_code,
    }
    let http = new Http();
    // Store response from PROMISE in object
    http.makeRequest('POST', `${URL}/recruitment/login`, data)
        .then(function (response) {

            console.log("Success!", response);
            res = JSON.parse(response)
            if (res.success === true) {
                token = res.token
                user_id = res.user.id
                country = res.user.country
                company_code = res.user.company_code
                permission_consent = res.user.consent
                profile_picture = res.user.profile_picture
                loading.style.display = "none"
                path_name = window.location.href

            }
            window.location.href = `${FE_URL}/recruitment-bot/recruitment-user-chats/?==${btoa(token)}?==${btoa(user_id)}?==${btoa(company_code)}?==${btoa(path_name)}?==${country}?==${permission_consent}?==${profile_picture}`;


        }, error => {
            login_submit.style.display = "block"
            loading.style.display = "none"
            // failure_box.style.display = "block"

            Swal.fire({
                title: 'Login failed!',
                text: 'Invalid Credentials. Please try again',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: "#232F3E",
            })
            // loading.style.display = "none"
        }).catch(error => {
            login_submit.style.display = "block"
            loading.style.display = "none"
            // failure_box.style.display = "block"

            Swal.fire({
                title: 'Login failed!',
                text: 'Invalid Credentials. Please try again',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: "#232F3E",
            })
        })

}
function forgotPassword() {


    let email = document.getElementById('login_email').value;
    let company_code = document.getElementById('login_company_code').value
    let loading = document.getElementById('loading_api2');
    let forgot_button = document.getElementById("forgot_button");

    // alert_box.style.display="none"
    if (email == "") {
        Swal.fire({
            text: 'Please provide your registered email!',
            // icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: "#232F3E"
        })
        return;
    }
    if (company_code == "") {
        Swal.fire({
            text: 'Please provide your comapany code',
            confirmButtonText: 'OK',
            confirmButtonColor: "#232F3E"
        })
        return;
    }
    let current_address = window.location.href
    let data = {
        email: email,
        url: btoa(current_address),
        company_code: company_code

    }
    loading.style.display = "block"
    forgot_button.style.display = "none"
    let http = new Http();
    // Store response from PROMISE in object
    http.makeRequest('POST', `${URL}/recruitment/password/create`, data)
        .then(function (response) {

            // console.log("Success!", response);
            res = JSON.parse(response)
            if (res.success === true) {
                loading.style.display = "none"
                forgot_button.style.display = "block"
                Swal.fire({
                    text: res.data.msg,
                    confirmButtonText: 'OK',
                    confirmButtonColor: "#232F3E",
                })
            }



        }, error => {
            forgot_button.style.display = "block"
            loading.style.display = "none"

            Swal.fire({
                title: 'Failed!',
                text: "We couldn't find a user with this e-mail address.",
                icon: 'error',
                confirmButtonColor: "#232F3E",
                confirmButtonText: 'OK'

            })
            // loading.style.display = "none"
        })
    // console.log(email,password)
}

// Prompt Alert Boxes Bases upon API Response
function regAlert() {
    let alert_box = document.getElementById('reg_alert_box')
    let close_alert = document.getElementById('close_reg_alert_form')
    document.getElementById('login_form').style.display = "block";
    document.getElementById('register_form').style.display = "none"
    let register_tab = document.getElementById('register_tab')
    let login_tab = document.getElementById('login_tab')
    // close_alert.style.display ="none"
    alert_box.style.display = "none";
    login_tab.style.color = "white";
    login_tab.style.background = "#330867"
    register_tab.style.background = "white"
    register_tab.style.color = "#330867"
    register_tab.style.borderColor = "#330867"

}
function logAlert() {
    let alert_box = document.getElementById('log_alert_box')
    alert_box.style.display = "none"
}
function failAlert() {
    let failure_alert = document.getElementById('failure_alert')
    failure_alert.style.display = "none"
}
function failResumeAlert() {
    let failure_alert = document.getElementById('failure_resume_alert')
    let alert_box = document.getElementById('reg_alert_box')
    let close_alert = document.getElementById('close_reg_alert_form')
    document.getElementById('login_form').style.display = "block";
    document.getElementById('register_form').style.display = "none"
    document.getElementById('reg_alert_box').style.display = "none"
    failure_alert.style.display = "none"
}

// HTTP HELPER METHODS TO MAKE REQUESTS TO API
function Http() {
    /**
     * Helper for http calls
     * @param method
     * @param url
     * @param data
     * @returns {Promise}
     
     */
    function makeRequestFile(method, url, data) {
        var data = data || '';
        // Return a new promise.
        return new Promise(function (resolve, reject) {
            let req = new XMLHttpRequest();
            req.open(method, url);

            req.onload = function () {
                if (req.status == 200) {
                    resolve(req.response);
                }
                else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function () {
                reject(Error("Something went wrong ... "));
            };
            // req.send(data);
            req.setRequestHeader('Accept', 'application/json');
            req.send(
                data
            );

        });
    }
    function makeRequest(method, url, data) {
        var data = data || '';
        // Return a new promise.
        return new Promise(function (resolve, reject) {
            let req = new XMLHttpRequest();
            req.open(method, url);

            req.onload = function () {
                if (req.status == 200) {
                    resolve(req.response);
                }
                else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function () {
                reject(Error("Something went wrong ... "));
            };
            // req.send(data);
            req.setRequestHeader('Accept', 'application/json');
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(
                data
            ));

        });
    }
    function sendRequest(url, token) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', url);
            req.setRequestHeader('Accept', 'application/json');
            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('Authorization', 'Bearer ' + token);
            req.onload = () => {
                if (req.status == 200) {
                    // console.log(req.response)
                    resolve(req);
                }
                else {
                    reject(Error(req.statusText));
                }
            }
            req.onerror = function () {
                reject(Error("Something went wrong ... "));
            };
            req.send()

        })
    }

    this.sendRequest = sendRequest;
    this.makeRequest = makeRequest;
    this.makeRequestFile = makeRequestFile;

}