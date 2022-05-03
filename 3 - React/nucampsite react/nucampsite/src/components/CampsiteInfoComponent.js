import React from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Link } from "react-router-dom";

import { LocalForm, Control, Errors } from "react-redux-form";
import Label from "reactstrap/lib/Label";

import { Loading } from './LoadingComponent';




//can just import in here insted pass through 3 components
// import {addComment} from '../redux/ActionCreators'

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;


class CommentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  handleSubmit(values) {

    this.props.addComment(this.props.campsiteId, values.rating, values.author, values.text)

    // console.log("Current state is:" + JSON.stringify(values));
    // alert("Current state is:" + JSON.stringify(values));
    this.toggleModal();
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <Label htmlFor="raiting">Raiting</Label>
              <Control.select
                model=".raiting"
                id="raiting"
                name="raiting"
                defaultValue={1}
                placeholder="1"
                className="form-control"
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Control.select>

              <Label htmlFor="author">Your name</Label>
              <Control.text
                model=".author"
                id="author"
                name="author"
                placeholder="Your name"
                className="form-control"
                validators={{
                  required,
                  minLength: minLength(2),
                  maxLength: maxLength(15),
                }}
              />
              <Errors
                className="text-danger"
                model=".author"
                show="touched"
                component="div"
                messages={{
                  required: "Required",
                  minLength: "Must be at least 2 characters",
                  maxLength: "Must be 15 characters or less",
                }}
              />
              <Label htmlFor="text">Comment</Label>
              <Control.textarea
                model=".text"
                id="text"
                name="text"
                rows="12"
                className="form-control"
              />
              <Button value="submit" type="submit">
                Submit
              </Button>
            </LocalForm>
          </ModalBody>
        </Modal>
        <Button outline={true} onClick={this.toggleModal}>
          <i className="fa-lg fa fa-pencil "></i> Submit Comment
        </Button>
      </div>
    );
  }
}

function RenderCampsite({ campsite }) {
  return (
    <div className="col-md-5 m-1">
      <Card>
        <CardImg top src={campsite.image} alt={campsite.name} />
        <CardBody>
          <CardText>{campsite.description}</CardText>
        </CardBody>
      </Card>
    </div>
  );
}

function RenderComments({ comments, addComment, campsiteId }) {
  console.log(comments);
  if (comments) {
    return (
      <div className="col-md-5 m-1">
        <h4>Comments</h4>
        {comments.map((comment) => {
          return (
            <div key={comment.id}>
              <p>{comment.text}</p>
              <p>
                {comment.author} -{" "}
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                }).format(new Date(Date.parse(comment.date)))}
              </p>
            </div>
          );
        })}
        <CommentForm
          addComment={addComment}
          campsiteId={campsiteId}
        />
      </div>
    );
  }
  return <div></div>;
}

function CampsiteInfo(props) {
  if (props.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  }
  if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h4>{props.errMess}</h4>
          </div>
        </div>
      </div>
    );
  }
  if (props.campsite) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/directory">Directory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
            </Breadcrumb>
            <h2>{props.campsite.name}</h2>
            <hr />
          </div>
        </div>
        <div className="row">
          <RenderCampsite campsite={props.campsite} />
          <RenderComments
            comments={props.comments}
            addComment={props.addComment}
            campsiteId={props.campsite.id}
          />
        </div>
      </div>
    );
  }
  return <div></div>;
}

export default CampsiteInfo;