import React from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Button } from 'semantic-ui-react';
import styles from './ProfileImageEditor.module.css';

type EditProfileImageState = {
  image: string;
  allowZoomOut: boolean;
  position: { x: number; y: number };
  scale: number;
  rotate: number;
  borderRadius: number;
  width: number;
  height: number;
};

type Props = {
  currentProfileImage: string;
  setEditorRef: (editor: AvatarEditor) => void;
  cropAndSubmitImage: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

class ProfileImageEditor extends React.Component<Props, EditProfileImageState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      image: this.props.currentProfileImage,
      allowZoomOut: false,
      position: { x: 0.5, y: 0.5 },
      scale: 1,
      rotate: 0,
      borderRadius: 0,
      width: 250,
      height: 250
    };
  }

  handleNewImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const newImage = URL.createObjectURL(e.target.files[0]);
    this.setState({ image: newImage });
  };

  handleScale = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const scale = parseFloat(e.target.value);
    this.setState({ scale });
  };

  handlePositionChange = (position: { x: number; y: number }): void => {
    this.setState({ position });
  };

  handleRotateLeft = (): void => {
    const rotate = (this.state.rotate % 360) - 90;
    this.setState({ rotate });
  };

  handleRotateRight = (): void => {
    const rotate = (this.state.rotate % 360) + 90;
    this.setState({ rotate });
  };

  render(): JSX.Element {
    return (
      <div className={styles.avatarAndEditorContainer}>
        <div>
          <AvatarEditor
            ref={this.props.setEditorRef}
            scale={this.state.scale}
            width={this.state.width}
            height={this.state.height}
            position={this.state.position}
            onPositionChange={this.handlePositionChange}
            rotate={this.state.rotate}
            borderRadius={this.state.width / (100 / this.state.borderRadius)}
            image={this.state.image}
            crossOrigin="anonymous"
          />
        </div>

        <div className={styles.editorContainer}>
          <div className={styles.labelComponentPair}>
            <label htmlFor="newImage" className={styles.label}>
              New File:
            </label>
            <input
              id="newImage"
              type="file"
              accept="image/png, image/jpeg"
              onChange={this.handleNewImage}
              className={styles.inputWithLabel}
            />
          </div>

          <div className={styles.labelComponentPair}>
            <label htmlFor="scale" className={styles.label}>
              Zoom:
            </label>
            <input
              id="scale"
              type="range"
              onChange={this.handleScale}
              min={this.state.allowZoomOut ? '0.1' : '1'}
              max="2"
              step="0.01"
              defaultValue="1"
              className={styles.inputWithLabel}
            />
          </div>

          <div className={styles.labelComponentPair}>
            <label className={styles.label}>Rotate:</label>
            <Button
              onClick={this.handleRotateLeft}
              className={styles.inputWithLabel}
              content="Left"
              size="mini"
            ></Button>
            <Button
              onClick={this.handleRotateRight}
              className={styles.inputWithLabel}
              content="Right"
              size="mini"
            ></Button>
          </div>

          <div className={[styles.labelComponentPair, styles.buttonWrapper].join(' ')}>
            <Button color="black" onClick={() => this.props.setOpen(false)}>
              Discard
            </Button>

            <Button
              content="Submit"
              labelPosition="right"
              icon="checkmark"
              onClick={this.props.cropAndSubmitImage}
              positive
              className={styles.inputWithLabel}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileImageEditor;
