import {FaceFrownIcon} from "@heroicons/react/24/outline";

export default function NotFound() {
	return (
		<main style={{textAlign: "center", padding: "2rem"}}>
			<div style={{width: "48px", height: "48px", margin: "0 auto"}}>
				<FaceFrownIcon className='w-full h-full text-gray-400' />
			</div>
			<h1>Product Not Found</h1>
			<p>Sorry, we couldn’t find the product you were looking for.</p>
		</main>
	);
}
