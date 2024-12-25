import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match",
};

interface Props {
  params: {
    id: string;
  }
};

const MatchPage = ({ params }: Props) => {
  return (
    <div>MatchPage</div>
  )
}

export default MatchPage;