"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { showLoader } from '@/lib/store/slices/loaderSlice';
import { useDispatch } from 'react-redux';
import router from 'next/router';

export default function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment !== '');
  const dispatch = useDispatch();
const router = useRouter();
  return (
    <nav className="text-gray-600 py-3 px-6">
      <ul className="flex items-center space-x-2">
        <li>
          <div onClick={() => {
                dispatch(showLoader(`Loading Dashboard..`));
                router.push("/dashboard")
              }}  className="hover:underline cursor-pointer">
            Dashboard
          </div>
        </li>
        {pathSegments.map((segment, index) => {
          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;

          // Skip 'protected' and 'dashboard' segments as they are handled by the base link
          if (segment === 'protected' || segment === 'dashboard') {
            return null;
          }

          return (
            <Fragment key={href}>
              <span>/</span>
              <li>
                {isLast ? (
                  <span className="text-gray-900 font-semibold capitalize">
                    {segment.replace(/-/g, ' ')}
                  </span>
                ) : (
                  <Link href={href} className="hover:underline capitalize">
                    {segment.replace(/-/g, ' ')}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ul>
    </nav>
  );
} 