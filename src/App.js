import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import Members from './component/Members/Members.js';
import Form from './component/Form/Form.js';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      members: [],
      first_name: "",
      last_name: "",
      buttonDisabled: false,
      formStatus: "create",
      memberIdSelected: null
    }
  }

  componentDidMount(){
    axios.get("https://reqres.in/api/users?page=1")
    .then(response => {
      this.setState({ members: response.data.data })
    })
    .catch(error => {
      console.log(error)
    })
  }

  inputChangeHandler = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  submitButtonHandler = event => {
    console.log("Form berhasil Submit")
    event.preventDefault()
    this.setState({ buttonDisabled: true })
    let payload = {
      first_name: this.state.first_name,
      last_name: this.state.last_name
    };
    let url = "";
    if (this.state.formStatus === "create"){
      url = "https://reqres.in/api/users";
      this.addMember(url, payload)
    } else{
      url = `https://reqres.in/api/users/${this.state.memberIdSelected}`;
      this.editMember(url, payload)
    }
  }
  addMember = (url, payload) => {
    axios.post(url, payload)
    .then(response => {
      console.log(response);
      let members = [...this.state.members]
      members.push(response.data)
      this.setState({ members, buttonDisabled: false, first_name: "",  last_name: ""})
    })
    .catch(error => {
      console.log(error);
    })
  }

  editMember = (url, payload) => {
    axios.put(url, payload)
    .then(response => {
      let members = [...this.state.members]
      let indexMember = members.findIndex(member => member.id === this.state.memberIdSelected)

      members[indexMember].first_name = response.data.first_name
      members[indexMember].last_name = response.data.last_name

      this.setState({
        members,
        buttonDisabled: false,
        first_name: "",
        last_name: "",
        formStatus: "create"
      })
    }).catch(error => {
      console.log(error)
    })
  }

  editButtonHandler = member => {
    this.setState({
      first_name: member.first_name,
      last_name: member.last_name,
      formStatus: "edit",
      memberIdSelected: member.id
    })
  }

  deleteButtonHandler = id => {
    let url = `https://reqres.in/api/users/${id}`
    axios.delete(url)
    .then(response => {
      if(response.status === 204){
        let members = [...this.state.members]
        let indexMember = members.findIndex(member => member.id === id)
        members.splice(indexMember, 1)
        this.setState({ members })
      }
    })
    .catch(error => {
      console.log(error)
    })
  }
  render () {
    return (
      <div className="container">
        <h1>Codepolitan Devschool</h1>
        <div className="row">
          <div className="col-md-6" style={{ border: "1px solid black" }}>
            <h2>Member</h2>
            <div className="row">
              <Members 
                members = {this.state.members}
                editButtonClick = {(member) => this.editButtonHandler(member)}
                deleteButtonClick = {(id) => this.deleteButtonHandler(id)}
              />
            </div>
          </div>
          <div className="col-md-6" style={{ border: "1px solid black" }}>
            <h2>Form {this.state.formStatus}</h2>
            <Form 
              onSubmitForm = {this.submitButtonHandler}
              onChange = {this.inputChangeHandler}
              first_name = {this.state.first_name}
              last_name = {this.state.last_name}
              buttonDisabled = {this.state.buttonDisabled}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
