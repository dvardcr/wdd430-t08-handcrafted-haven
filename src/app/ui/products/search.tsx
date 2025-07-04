"use client";

import {useSearchParams, usePathname, useRouter} from "next/navigation";
import {useDebouncedCallback} from "use-debounce";

export default function Search({placeholder}: {placeholder: string}) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const {replace} = useRouter();

	const handleSearch = useDebouncedCallback((term: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", "1");
		if (term) {
			params.set("query", term);
		} else {
			params.delete("query");
		}

		replace(`${pathname}?${params.toString()}`);
	}, 300);

	return (
		<div className='relative flex flex-1 flex-shrink-0'>
			<label htmlFor='search' className='sr-only'>
				Search
			</label>
			<input
				id='search'
				className='peer block w-full rounded-md border border-gray-700 bg-gray-900 py-[9px] pl-10 text-sm text-gray-200 placeholder:text-gray-400 outline-2'
				placeholder={placeholder}
				onChange={(e) => handleSearch(e.target.value)}
				defaultValue={searchParams.get("query")?.toString()}
			/>
		</div>
	);
}
