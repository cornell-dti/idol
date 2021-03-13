type Props = {
  readonly aws?: boolean;
  readonly className?: string;
  readonly lazy?: string;
  readonly image?: string;
  readonly video?: string | { readonly webm: string; readonly mp4: string };
};

export default function LazyVideo({
  aws,
  className,
  lazy,
  image,
  video
}: Props): JSX.Element {
  const children: JSX.Element[] = [];
  if (video) {
    if (aws != null ? aws : true) {
      if (typeof video === 'string') {
        children.push(<source key="mp4" type="video/mp4" src={video} />);
      } else {
        children.push(<source key="webm" type="video/webm" src={video.webm} />);
        children.push(<source key="mp4" type="video/mp4" src={video.mp4} />);
      }
    } else {
      children.push(
        <source key="mp4" type="video/mp4" src={video as string} />
      );
    }
  } else {
    children.push(<source key="mp4" type="video/mp4" src="" />);
  }

  if (image) children.push(<img key="image" src={image} alt="" />);
  if (lazy) children.push(<img key="lazy" src={lazy} alt="" />);

  return (
    <video className={className} playsInline muted autoPlay loop poster={lazy}>
      {children}
    </video>
  );
}
