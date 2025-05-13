import './Tile.css';

interface Props {
  image?: string;
  number: number;
  highlight?: boolean;
}

export default function Tile({ number, image, highlight }: Props) {
  const isBlack = number % 2 === 0;
  const tileClass = isBlack ? 'tile black-tile' : 'tile white-tile';
  const highlightClass = highlight ? 'highlight-tile' : '';

  return (
    <div className={`${tileClass} ${highlightClass}`}>
      {image && (
        <div
          style={{ backgroundImage: `url(${image})` }}
          className="chess-piece"
        ></div>
      )}
    </div>
  );
}
