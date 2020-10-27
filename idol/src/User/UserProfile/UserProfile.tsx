import React, { useContext, useState } from 'react';
import { Form, TextArea } from 'semantic-ui-react'
import { UserContext } from '../../UserProvider/UserProvider';

type User = {
  firstName: string,
  lastName: string,
  graduation: string,
  major: string,
  doubleMajor: string,
  minor: string,
  hometown: string,
  about: string,
  website: string,
  linkedin: string,
  github: string
}

const morgan: User = {
  firstName: 'Morgan',
  lastName: 'Belous',
  graduation: 'May 2022',
  major: "Computer Science",
  doubleMajor: "",
  minor: "Business",
  hometown: "Dix Hills, NY",
  about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla ultrices nisi id iaculis. Etiam consequat scelerisque erat, eget fermentum arcu tincidunt feugiat. Maecenas et arcu non urna feugiat pharetra et eget justo. Pellentesque tempus diam eu tempus bibendum. Nam quis sagittis tortor, ac condimentum turpis. Etiam facilisis sit amet tortor ac rutrum. In arcu tortor, imperdiet aliquam blandit sed, commodo vel justo. Donec elementum pretium dolor sit amet mollis. Suspendisse convallis commodo turpis vitae aliquam. Vivamus sed suscipit est. Nullam sed ullamcorper mi, eget aliquam massa. Mauris consequat ipsum magna, at condimentum ex bibendum sodales. Vestibulum tellus sapien, bibendum sit amet dui a, malesuada malesuada nulla. Quisque ligula neque, sollicitudin ac egestas sed, tempor sed nibh Morbi tempor, turpis at auctor tincidunt, elit dolor euismod tellus, a maximus erat metus vel turpis. Suspendisse eu urna risus. Sed varius viverra nisi, eu ornare justo tristique vel. Aenean pellentesque dignissim augue, imperdiet condimentum magna malesuada sit amet. Etiam luctus vitae odio non laoreet. Pellentesque congue elit volutpat, blandit enim sit amet, ultrices dui. Nam at diam viverra, rhoncus tellus elementum, sagittis libero. Aenean sollicitudin laoreet ullamcorper. Pellentesque facilisis vestibulum libero eget cursus. Phasellus ullamcorper scelerisque viverra. Pellentesque in malesuada nibh. Vivamus sodales erat non sapien ornare egestas. Sed sagittis condimentum ligula, ut finibus sem pretium ac. Mauris finibus nisi faucibus, vehicula felis vitae, pretium neque. Donec mollis bibendum tempus. Pellentesque gravida justo a sapien dapibus molestie. Pellentesque hendrerit odio nec interdum elementum.",
  website: "morgan's website",
  linkedin: "morgan's linkedin",
  github: "morgan's github"
};

const UserProfile: React.FC = () => {

  // send user.user?.email from useContext to backend to find the user, retrieve all information, set it here
  const [firstName, setFirstName] = useState(morgan.firstName);
  const [lastName, setLastName] = useState(morgan.lastName);
  const [graduation, setGraduation] = useState(morgan.graduation);
  const [major, setMajor] = useState(morgan.major);
  const [doubleMajor, setDoubleMajor] = useState(morgan.doubleMajor);
  const [minor, setMinor] = useState(morgan.minor);
  const [hometown, setHometown] = useState(morgan.hometown);
  const [about, setAbout] = useState(morgan.about);
  const [website, setWebsite] = useState(morgan.website);
  const [linkedin, setLinkedin] = useState(morgan.linkedin);
  const [github, setGithub] = useState(morgan.github);

  const isFilledOut = (fieldInput: string): boolean => {
    return fieldInput.trim().length === 0 ? false : true;
  }

  const saveProfileInfo = () => {
    const requiredFields = [firstName, lastName, graduation, major, hometown, about];
    const isValid = requiredFields.every(isFilledOut);

    if (isValid) {
      console.log("all required fields complete, send info to backend");
    }
  }

  return (
    <Form style={{ width: '80%', alignSelf: 'center', margin: 'auto', marginTop: '10vh' }}>
      <Form.Group widths='equal'>
        <Form.Input fluid label='First name' value={firstName} onChange={event => setFirstName(event.target.value)} required />
        <Form.Input fluid label='Last name' value={lastName} onChange={event => setLastName(event.target.value)} required />
      </Form.Group >

      <Form.Group widths='equal'>
        <Form.Input fluid label='Graduation' value={graduation} onChange={event => setGraduation(event.target.value)} required />
        <Form.Input fluid label='Hometown' value={hometown} onChange={event => setHometown(event.target.value)} required />
      </Form.Group>

      <Form.Group widths='equal'>
        <Form.Input fluid label='Major' value={major} onChange={event => setMajor(event.target.value)} required />
        <Form.Input fluid label='Double Major' value={doubleMajor} onChange={event => setDoubleMajor(event.target.value)} />
        <Form.Input fluid label='Minor' value={minor} onChange={event => setMinor(event.target.value)} />
      </Form.Group>

      <Form.Input label='About' name='about' value={about} control={TextArea} onChange={event => setAbout(event.target.value)} style={{ minHeight: '25vh' }} required />

      <Form.Group widths='equal'>
        <Form.Input fluid label='Website' value={website} onChange={event => setWebsite(event.target.value)} />
        <Form.Input fluid label='LinkedIn' value={linkedin} onChange={event => setLinkedin(event.target.value)} />
        <Form.Input fluid label='GitHub' value={github} onChange={event => setGithub(event.target.value)} />
      </Form.Group>

      <Form.Button onClick={saveProfileInfo}>Save</Form.Button>
    </Form >
  )
}

export default UserProfile;